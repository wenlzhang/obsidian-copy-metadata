import { App, Plugin, PluginSettingTab, Setting, TFile, moment, Notice } from 'obsidian'

interface CopyMetadataSettings {
  useKeyupEvents: boolean;
  timeout: number;
  creationTimeFormat: string;
  copyCreationTimeToClipboard: boolean;
  appendCreationTimeFormat: string;
  appendCreationTimeToFileName: boolean;
}

const DEFAULT_SETTINGS: CopyMetadataSettings = {
  useKeyupEvents: false,
  timeout: 10,
  creationTimeFormat: 'YYYYMMDDHHmm',
  copyCreationTimeToClipboard: true,
  appendCreationTimeFormat: 'YYYYMMDDHHmm',
  appendCreationTimeToFileName: false,
}

export default class CopyMetadata extends Plugin {
  settings: CopyMetadataSettings
  timer: { [key: string]: number } = {}

  async onload () {
    await this.loadSettings()

    this.addSettingTab(new CopyMetadataSettingTab(this.app, this))

    // Add commands
    this.addCommand({
      id: 'copy-creation-time-to-clipboard',
      name: 'Copy creation time to clipboard',
      callback: () => this.copyCreationTime(),
    });

    this.addCommand({
      id: 'append-creation-time-to-file-name',
      name: 'Append creation time to file name',
      callback: () => this.appendCreationTimeToFileName(),
    });
  }

  async copyCreationTime() {
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      const creationTime = moment(activeFile.stat.ctime).format(this.settings.creationTimeFormat);
      navigator.clipboard.writeText(creationTime);
    }
  }

  async appendCreationTimeToFileName() {
    const activeFile = this.app.workspace.getActiveFile();
    if (activeFile) {
      const creationTime = moment(activeFile.stat.ctime).format(this.settings.appendCreationTimeFormat);

      // Create the new file name by appending the creation time to the existing name
      const newFileName = `${activeFile.basename}${creationTime}.${activeFile.extension}`;

      // Create the new file path by appending the new file name to the current directory
      const newFilePath = `${activeFile.path.substring(0, activeFile.path.lastIndexOf("/"))}/${newFileName}`;

      // Rename the file
      try {
        if (this.settings.appendCreationTimeToFileName) {
          await this.app.fileManager.renameFile(activeFile, newFilePath);
          new Notice('File name updated successfully.');
          console.log('File name updated successfully.');
        } else {
          new Notice('Append creation time to file name setting is disabled!');
        }
      } catch (error) {
        new Notice('Failed to update file name!');
        console.log(error);
      }
    } else {
      new Notice('No active file to update!');
    }
  }

  async loadSettings () {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData())
  }

  async saveSettings () {
    await this.saveData(this.settings)
  }

  /**
   * Use a timeout to update the metadata only once the user has stopped typing.
   * If the user keeps typing, then it will reset the timeout and start again from zero.
   *
   * Obsidian doesn't appear to correctly handle this situation otherwise, and pops an
   * error to say "<File> has been modified externally, merging changes automatically."
   *
   * @param {TFile} file
   */
}

class CopyMetadataSettingTab extends PluginSettingTab {
  plugin: CopyMetadata

  constructor (app: App, plugin: CopyMetadata) {
    super(app, plugin)
    this.plugin = plugin
  }

  display (): void {
    const { containerEl } = this

    containerEl.empty()

    // this.containerEl.createEl("h1", { text: "Copy Metadata" });
  
    this.containerEl.createEl("h3", {
        text: "Please try reopening the vault or restarting Obsidian if the following setting changes do not take effect.",
    });

    // this.containerEl.createEl("h2", { text: "Creation time" });

    // Date format for creation time setting
    new Setting(containerEl)
    .setName('Copy creation time format')
    .setDesc('MomentJS format, e.g., YYYY-MM-DDTHH:mm.')
    .addText(text => text
      .setPlaceholder('YYYY-MM-DDTHH:mm')
      .setValue(this.plugin.settings.creationTimeFormat)
      .onChange(async (value) => {
        this.plugin.settings.creationTimeFormat = value;
        await this.plugin.saveSettings();
      }));
    
    new Setting(containerEl)
    .setName('Append creation time to file name')
    .addToggle(toggle => {
      toggle
        .setValue(this.plugin.settings.appendCreationTimeToFileName)
        .onChange(async (value) => {
          this.plugin.settings.appendCreationTimeToFileName = value;
          await this.plugin.saveSettings();
        });
    });

    // Add a new setting for the append creation time format
    new Setting(containerEl)
    .setName('Append creation time format')
    .setDesc('MomentJS format, e.g., YYYY-MM-DDTHH:mm.')
    .addText(text => text
      .setPlaceholder('YYYYMMDDHHmm')
      .setValue(this.plugin.settings.appendCreationTimeFormat)
      .onChange(async (value) => {
        this.plugin.settings.appendCreationTimeFormat = value;
        await this.plugin.saveSettings();
      }));
  }
}
