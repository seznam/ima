import path from 'path';

enum LinuxEditors {
  'atom' = 'atom',
  'Brackets' = 'brackets',
  'code' = 'code',
  'code-insiders' = 'code-insiders',
  'vscodium' = 'vscodium',
  'emacs' = 'emacs',
  'gvim' = 'gvim',
  'idea.sh' = 'idea',
  'phpstorm.sh' = 'phpstorm',
  'pycharm.sh' = 'pycharm',
  'rubymine.sh' = 'rubymine',
  'sublime_text' = 'sublime_text',
  'vim' = 'vim',
  'webstorm.sh' = 'webstorm',
  'goland.sh' = 'goland',
  'rider.sh' = 'rider',
}

enum DarwinEditors {
  '/Applications/Atom.app/Contents/MacOS/Atom' = 'atom',
  '/Applications/Atom Beta.app/Contents/MacOS/Atom Beta' = '/Applications/Atom Beta.app/Contents/MacOS/Atom Beta',
  '/Applications/Brackets.app/Contents/MacOS/Brackets' = 'brackets',
  '/Applications/Sublime Text.app/Contents/MacOS/Sublime Text' = '/Applications/Sublime Text.app/Contents/SharedSupport/bin/subl',
  '/Applications/Sublime Text Dev.app/Contents/MacOS/Sublime Text' = '/Applications/Sublime Text Dev.app/Contents/SharedSupport/bin/subl',
  '/Applications/Sublime Text 2.app/Contents/MacOS/Sublime Text 2' = '/Applications/Sublime Text 2.app/Contents/SharedSupport/bin/subl',
  '/Applications/Visual Studio Code.app/Contents/MacOS/Electron' = 'code',
  '/Applications/Visual Studio Code - Insiders.app/Contents/MacOS/Electron' = 'code-insiders',
  '/Applications/VSCodium.app/Contents/MacOS/Electron' = 'vscodium',
  '/Applications/AppCode.app/Contents/MacOS/appcode' = '/Applications/AppCode.app/Contents/MacOS/appcode',
  '/Applications/CLion.app/Contents/MacOS/clion' = '/Applications/CLion.app/Contents/MacOS/clion',
  '/Applications/IntelliJ IDEA.app/Contents/MacOS/idea' = '/Applications/IntelliJ IDEA.app/Contents/MacOS/idea',
  '/Applications/PhpStorm.app/Contents/MacOS/phpstorm' = '/Applications/PhpStorm.app/Contents/MacOS/phpstorm',
  '/Applications/PyCharm.app/Contents/MacOS/pycharm' = '/Applications/PyCharm.app/Contents/MacOS/pycharm',
  '/Applications/PyCharm CE.app/Contents/MacOS/pycharm' = '/Applications/PyCharm CE.app/Contents/MacOS/pycharm',
  '/Applications/RubyMine.app/Contents/MacOS/rubymine' = '/Applications/RubyMine.app/Contents/MacOS/rubymine',
  '/Applications/WebStorm.app/Contents/MacOS/webstorm' = '/Applications/WebStorm.app/Contents/MacOS/webstorm',
  '/Applications/MacVim.app/Contents/MacOS/MacVim' = 'mvim',
  '/Applications/GoLand.app/Contents/MacOS/goland' = '/Applications/GoLand.app/Contents/MacOS/goland',
  '/Applications/Rider.app/Contents/MacOS/rider' = '/Applications/Rider.app/Contents/MacOS/rider',
}

enum Win32Editors {
  'Brackets.exe' = 'Brackets.exe',
  'Code.exe' = 'Code.exe',
  'Code - Insiders.exe' = 'Code - Insiders.exe',
  'VSCodium.exe' = 'VSCodium.exe',
  'atom.exe' = 'atom.exe',
  'sublime_text.exe' = 'sublime_text.exe',
  'notepad++.exe' = 'notepad++.exe',
  'clion.exe' = 'clion.exe',
  'clion64.exe' = 'clion64.exe',
  'idea.exe' = 'idea.exe',
  'idea64.exe' = 'idea64.exe',
  'phpstorm.exe' = 'phpstorm.exe',
  'phpstorm64.exe' = 'phpstorm64.exe',
  'pycharm.exe' = 'pycharm.exe',
  'pycharm64.exe' = 'pycharm64.exe',
  'rubymine.exe' = 'rubymine.exe',
  'rubymine64.exe' = 'rubymine64.exe',
  'webstorm.exe' = 'webstorm.exe',
  'webstorm64.exe' = 'webstorm64.exe',
  'goland.exe' = 'goland.exe',
  'goland64.exe' = 'goland64.exe',
  'rider.exe' = 'rider.exe',
  'rider64.exe' = 'rider64.exe',
}

/**
 * Get exec args for given filename to open at exact
 * line and column numbers in the specified editor.
 */
function getEditorArgsForLineNumber(
  editor: string,
  fileName: string,
  lineNumber: number,
  colNumber: number
): string[] {
  const editorBasename = path.basename(editor).replace(/\.(exe|cmd|bat)$/i, '');

  switch (editorBasename) {
    case 'atom':
    case 'Atom':
    case 'Atom Beta':
    case 'subl':
    case 'sublime':
    case 'sublime_text':
      return [fileName + ':' + lineNumber + ':' + colNumber];
    case 'wstorm':
    case 'charm':
      return [fileName + ':' + lineNumber];
    case 'notepad++':
      return ['-n' + lineNumber, '-c' + colNumber, fileName];
    case 'vim':
    case 'mvim':
    case 'joe':
    case 'gvim':
      return ['+' + lineNumber, fileName];
    case 'emacs':
    case 'emacsclient':
      return ['+' + lineNumber + ':' + colNumber, fileName];
    case 'rmate':
    case 'mate':
    case 'mine':
      return ['--line', lineNumber.toString(), fileName];
    case 'code':
    case 'Code':
    case 'code-insiders':
    case 'Code - Insiders':
    case 'vscodium':
    case 'VSCodium':
      return ['-g', fileName + ':' + lineNumber + ':' + colNumber];
    case 'appcode':
    case 'clion':
    case 'clion64':
    case 'idea':
    case 'idea64':
    case 'phpstorm':
    case 'phpstorm64':
    case 'pycharm':
    case 'pycharm64':
    case 'rubymine':
    case 'rubymine64':
    case 'webstorm':
    case 'webstorm64':
    case 'goland':
    case 'goland64':
    case 'rider':
    case 'rider64':
      return ['--line', lineNumber.toString(), fileName];
  }

  // For all others, drop the lineNumber until we have
  // a mapping above, since providing the lineNumber incorrectly
  // can result in errors or confusing behavior.
  return [fileName];
}

export {
  LinuxEditors,
  Win32Editors,
  DarwinEditors,
  getEditorArgsForLineNumber,
};
