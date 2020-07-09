import React from "react";
import * as Tone from "tone";
import { Link } from "react-router-dom";

//what users will see when they land on the home page
class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.state.track = [];
    this.playNote = this.playNote.bind(this);
    this.sleep = this.sleep.bind(this);
  }

  componentDidMount() {
    this.props.fetchBlocks();
    this.props.fetchTracks();
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
    let blocks = this.props.blocks || {};
    let tracks = this.props.tracks || [];
    // debugger;
    for (let i = 0; i < tracks.length; i++) {
      for (let j = 0; j < tracks[i].blocks.length; j++) {
        for (let b = 0; b < blocks.length; b++) {
          if (blocks[b]._id === tracks[i].blocks[j]) {
            tracks[i].blocks[j] = blocks[b];
          }
        }
      }
    }
    // debugger;
    return (
      <div className="main-page">
        <header>
          <strong>
            <h1 className="title">BLOX</h1>
          </strong>
          <small>BEAT</small>
        </header>

        <div className="top-tracks">The best rhythm-beat maker in the biz!</div>
        <br />
        <h3 className="top-tracks">Today's Tracks</h3>
        {tracks.map((track, i) => (
          <div className="track-outer" key={i}>
            <h4 id="tt">
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={`/tracks/${track._id}`}
              >
                {track.title}
              </Link>
            </h4>
            <h4 id="th">
              <Link
                style={{ textDecoration: "none", color: "black" }}
                to={`/users/${track.user._id}`}
              >
                by {track.user.handle}
              </Link>
            </h4>
            <div className="flexer">
              <img
                src="https://www.pinpng.com/pngs/m/47-472328_play-button-svg-png-icon-free-download-download.png"
                className="play-button"
                onClick={() => this.playNote(track)}
              ></img>
              <br />
              <Link className="link-to-track" to={`/tracks/${track._id}`}>
                <div className="track">
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
              </Link>
            </div>
          </div>
        ))}
      </div>
    );
  }
}

export default MainPage;
