var React = require('react');
var moment = require('moment');

var Message = React.createClass({
  render: function() {
    var formatedDate = moment(this.props.date).format('lll');
    return (
      <div className="message">
        <div className="author">
          {this.props.author}
        </div>
        <div className="content">
          {this.props.content}
          <span className="date-time">
            {formatedDate}
          </span>
        </div>
      </div>
    );
  }
});

module.exports = Message;