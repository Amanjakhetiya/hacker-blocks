import Ember from 'ember';
import getSnippet from '../../../utils/get-snippet';

export default Ember.Component.extend({
  didRender() {
    ace.require("ace/src/ext-language_tools");
    ace.require("ace/src/snippets");
    this._super(...arguments);
    let editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    const code = this.get("lang_codes");
    const allowedLanguages = this.get("allowedLanguages");
    let mode = null;
    if(allowedLanguages) {
      mode = code[allowedLanguages[0]].mode;
    }
    editor.getSession().setMode(mode || "ace/mode/c_cpp");
    editor.setOptions({
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true
    });
    if (this.get('readOnly') === true) {
      editor.setReadOnly(true);
    };
  }
});
