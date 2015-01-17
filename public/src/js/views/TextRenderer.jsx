/*jshint quotmark:false */
var React = require('react');
var _ = require('lodash');

var ESCAPE_KEY_CODE = 27;

var TextRenderer = React.createClass({
  getInitialState: function() {
    return {editing: false};
  },
  _submitEdit: function(event) {
    event.preventDefault();
    this.props.onSubmit(this.state.text);
    this._exitEnter();
  },
  _enterEdit: function() {
    this._setPartialState({editing: true, text: this.props.text}, function() {
      var inputElement = this.refs.textInput.getDOMNode();
      inputElement.focus();
      inputElement.select(); 
    });
  },
  _exitEnter: function() {
    this._setPartialState({editing: false});
  },
  _setPartialState: function(partialState, cb) {
    var newState = _.extend(this.state, partialState);
    this.setState(newState, cb);
  },
  _updateEditText: function(event) {
    this._setPartialState({text: event.target.value});
  },
  _keyDown: function(event) {
    if (event.keyCode === ESCAPE_KEY_CODE) {
      this._exitEnter();
    }
  },
  render: function() {
    var view;
    if (this.state.editing) {
      view =
      <form onSubmit={this._submitEdit}>
        <input type="text" value={this.state.text} 
          onChange={this._updateEditText} ref="textInput" 
          onKeyDown={this._keyDown}
          onBlur={this._submitEdit} />
      </form>;
    } else {
      view = 
      <div onClick={this._enterEdit}>
        {this.props.text}
      </div>;
    }
    
    return view;
  }
});

module.exports = TextRenderer;