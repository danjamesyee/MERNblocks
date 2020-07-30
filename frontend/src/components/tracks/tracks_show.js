import React from "react";
import * as Tone from "tone";
import CommentsContainer from "../comments/comments_container";
import { Link } from "react-router-dom";
import VotesContainer from "../votes/votes_container";
import * as ReactBootStrap from "react-bootstrap";
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";
import "react-notifications/lib/notifications.css";

//what users will see when they land on the home page
class TracksShowPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = { isLoading: true };
    // this.state.track = [];
    this.playNote = this.playNote.bind(this);
    this.sleep = this.sleep.bind(this);
  }

  componentDidMount() {
    this.props.fetchBlocks();
    this.props.fetchTrack(this.props.match.params.trackId);
    this.setState({ isLoading: false });
  }

  createNotification(track) {
    NotificationManager.warning(
      "Music can take up to 1 minute to play",
      "Please be patient",
      3000
    );
    console.log("end of first");
    // this.sleep(8000);
    // setTimeout(this.playNote(track), 100000000);
  }
  playNote(track) {
    Tone.Transport.start();
    const synth = new Tone.Synth().toMaster();
    for (let i = 0; i < track.blocks.length; i++) {
      synth.triggerAttackRelease(
        track.blocks[i].note,
        track.blocks[i].duration
      );
      if (track.blocks[i].duration === "16n") {
        this.sleep(200);
      } else if (track.blocks[i].duration === "8n") {
        this.sleep(400);
      } else if (track.blocks[i].duration === "4n") {
        this.sleep(800);
      }
    }
  }

  sleep(miliseconds) {
    var currentTime = new Date().getTime();

    while (currentTime + miliseconds >= new Date().getTime()) {}
  }

  render() {
    let blocks = Object.values(this.props.blocks) || [];
    let track = this.props.track || [];
    if (blocks.length === 0 || track.length === 0) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <ReactBootStrap.Spinner animation="border" />
        </div>
      );
    } else {
      for (let j = 0; j < track.blocks.length; j++) {
        for (let b = 0; b < blocks.length; b++) {
          if (blocks[b]._id === track.blocks[j]) {
            track.blocks[j] = blocks[b];
          }
        }
      }
    }
    let editLink;

    if (this.props.currentUser.id === track.user._id) {
      editLink = (
        <div>
          <Link id="show-edit" to={`/tracks/${track._id}/edit`}>
            Edit
          </Link>
          <div
            id="delete-track-button"
            onClick={() =>
              this.props
                .destroyTrack(track._id)
                .then(this.props.history.push(`/users/${track.user._id}`))
                .then(() => window.location.reload())
            }
          >
            Delete
          </div>
        </div>
      );
    } else {
      editLink = <div></div>;
    }

    return (
      <div>
        {this.state.isLoading ? (
          <ReactBootStrap.Spinner animation="border" />
        ) : (
          <div className="main-page">
            <header>
              <strong>
                <h1 className="title">BLOX</h1>
              </strong>
              <small>BEAT</small>
            </header>

            <div className="top-tracks">
              The best rhythm-beat maker in the biz!
            </div>
            <br />

            <div className="track-outer">
              <h4 id="show-title">{track.title}</h4>
              <h4 id="show-handle">
                <Link
                  style={{ textDecoration: "none", color: "black" }}
                  to={`/users/${track.user._id}`}
                >
                  by {track.user.handle}
                </Link>
              </h4>{" "}
              <br />
              <br />
              <div className="outer-track-container">
                <VotesContainer trackId={this.props.match.params.trackId} />
                <img
                  alt=""
                  src="https://www.pinpng.com/pngs/m/47-472328_play-button-svg-png-icon-free-download-download.png"
                  className="play-button"
                  onMouseEnter={this.createNotification}
                  onClick={() => this.playNote(track)}
                ></img>
                <div
                  className="track"
                  onMouseEnter={this.createNotification}
                  onClick={() => this.playNote(track)}
                >
                  {track.blocks.map((block, i) => (
                    <div
                      style={{
                        backgroundColor: block.color,
                        width: block.width,
                        height: block.height,
                      }}
                      key={i}
                    ></div>
                  ))}
                  <br />
                </div>
              </div>
              {editLink}
              <CommentsContainer trackId={this.props.match.params.trackId} />
            </div>
          </div>
        )}
        <NotificationContainer />
      </div>
    );
  }
}

export default TracksShowPage;
