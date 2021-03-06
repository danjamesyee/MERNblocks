import React from 'react';
import lodash from "lodash";

export default class CreateComment extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      text: '',
      buttons: false
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleComment = this.handleComment.bind(this);
  }

  // componentDidMount() {
  // }

  handleChange(e){
    this.setState({text: e.currentTarget.value, buttons: true });
  }

  // if create set back to empty, if edit return back to original comment
  handleCancel(e){
    e.preventDefault();
    this.setState({ text: '', buttons: false });
  }

  handleComment (e) {
    e.preventDefault();
    const data = { text: this.state.text , trackId: this.props.trackId }
    this.props.createComment(data)
    .then(() => this.setState({ text: '', buttons: false }))
    .then(() => this.props.fetchTrackComments(this.props.trackId));

  }

  render() {
    let buttons;
    if (this.state.buttons) {
      buttons = (
        <div className="show-page-comment-buttons">
          <div className="comment-button" onClick={this.handleCancel}>Cancel</div>&nbsp;
          <div className="comment-button" onClick={this.handleComment}>Comment</div>
        </div>
      );
    }

    if (lodash.isEmpty(this.props.currentUser)) {
      if (this.state.text.length > 0) {
        buttons = (
          <h3 className="comments-errors">* Must be logged in to post a comment</h3>
        )
      } else {
        buttons = <></>;
      }
    }

    return (
      <form className='create-comment-form'>
        
        <h4>Like this track?</h4>
        
        <input className="comment-box"
          type="text"
          placeholder="Add a comment (at least 2 chars, limit 150). . ."
          value={this.state.text}
          onChange={this.handleChange}
        />
        <hr/>

        {buttons}
        
      </form>
    )
  }
}