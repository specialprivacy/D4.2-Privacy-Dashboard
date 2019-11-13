import React, {Component} from 'react';

import MessageDialog from '../dialogs/MessageDialog';

import {Timeline, TimelineEvent} from 'react-event-timeline';

import IconButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';
import {Card, CardHeader, CardText, List, ListItem} from "material-ui";


import Fingerprint from 'material-ui/svg-icons/action/fingerprint';
import Hearing from 'material-ui/svg-icons/av/hearing';
import Visibility from 'material-ui/svg-icons/action/visibility';
import ActionTimeline from 'material-ui/svg-icons/action/timeline';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ContentCreate from 'material-ui/svg-icons/content/create';
import ContentClear from 'material-ui/svg-icons/content/clear';
import PanTool from 'material-ui/svg-icons/action/pan-tool';

import TextFormat from 'material-ui/svg-icons/content/text-format';
import InsertPhoto from 'material-ui/svg-icons/editor/insert-photo';
import AudioTrack from 'material-ui/svg-icons/image/audiotrack';
import PlayCircleFilled from 'material-ui/svg-icons/av/play-circle-filled';
import LocationOn from 'material-ui/svg-icons/communication/location-on';

import {Map, TileLayer, Marker} from 'react-leaflet';

import theme from "../data/controller.json";

const iconColor = theme.palette.iconColor;
const cardHeaderStyle = {backgroundColor: theme.palette.cardHeader1Color, color: "white"};
const moreMenuStyle = {position: "absolute", top: "12px", right: "12px"};
const moreButtonStyle = {minWidth: "auto", height: "auto", lineHeight: "auto"};
const menuOrigin = {horizontal: 'right', vertical: 'top'};

const typeArray = {
  // TODO: needs to be adjusted as soon as data has changed
  1: <Fingerprint/>,
  2: <Fingerprint/>,
  3: <Hearing/>,
  4: <Visibility/>,
  5: <ActionTimeline/>
};

const contextArray = {
  1: "Data I provided",
  2: "Data I provided",
  3: "Data of me provided by others",
  4: "Data of my behavior",
  5: "Inferred data about me"
};

const dataTypeArray = {
  "text": <TextFormat/>,
  "image": <InsertPhoto/>,
  "audio": <AudioTrack/>,
  "video": <PlayCircleFilled/>,
  "location": <LocationOn/>
};

class DataTimeline extends Component {

  state = {
    messageOpen: false,
    text: "",
  };

  toggleMessage = (text, e) => {
    this.setState({messageOpen: !this.state.messageOpen, text: text});
  };

  handleMessageDialog = (confirmed, e) => {
    this.toggleMessage("", null);
  };

  formulateMessage = (sw, purpose) => {
    var content = " Please respond to this request within one month (" + new Date(Date.now() + 2592000000).toDateString() + ") as ruled by the GDPR Article 12(3).";
    switch (sw) {
      case 1:
        content = "I hereby withdraw consent prior given for the purpose of " + purpose + " according to the GDPR Article 7(3)." + content;
        break;
      case 2:
        content = "I hereby request rectification of inaccurate personal data according to GDPR Article 16." + content;
        break;
      case 3:
        content = "I hereby request erasure of my personal data according to GDPR Article 17." + content;
        break;
      default:
        content = "";
        break;
    }
    return content;
  };

  generateIconMenu = (self, elem) => {
    return <IconMenu
      iconButtonElement={<IconButton style={moreButtonStyle}><MoreVertIcon/></IconButton>}
      style={moreMenuStyle}
      targetOrigin={menuOrigin}
      anchorOrigin={menuOrigin}
    >
      <MenuItem primaryText={
        <div>
          <b>Purpose:</b><br/>
          {elem.purpose}
        </div>}
      />
      <Divider/>
      <MenuItem leftIcon={<PanTool/>}
                onClick={self.toggleMessage.bind(null, self.formulateMessage(1, elem.purpose))}>Withdraw consent</MenuItem>
      <MenuItem leftIcon={<ContentCreate/>}
                onClick={self.toggleMessage.bind(null, self.formulateMessage(2, ""))}>Rectify</MenuItem>
      <MenuItem leftIcon={<ContentClear/>}
                onClick={self.toggleMessage.bind(null, self.formulateMessage(3, ""))}>Erase</MenuItem>
    </IconMenu>;
  };

  render() {

    if (this.props.data.length === 0) {
      return (
        <div style={{textAlign: "center"}}>No data to show</div>
      );
    } else {
      return (
        <div>
          <Timeline style={{position: "relative", padding: "10px 2px", width: "95%", margin: "0px auto"}}>
            {
              groupBy(this.props.data, (e) => new Date(e.date).toDateString()).map(function (self, e) {
                return (
                  <TimelineEvent
                    key={generateRandomKey()}
                    title=""
                    createdAt={<span>Data processed on {new Date(e.values[0].date).toDateString()}</span>}
                    icon={typeArray[e.values[0].context]}
                    iconColor={iconColor}
                    cardHeaderStyle={cardHeaderStyle}
                    container="card">
                    <div>Processed data categories: </div>
                    {
                      groupBy(e.values, "context")
                        .map((result) => result.values)
                        .map(function (category) {
                          return (
                            <Card
                              key={generateRandomKey()}
                              expandable={true}
                              initiallyExpanded={false}
                              style={{marginTop: "10px"}}>
                              <CardHeader
                                title={<span>{contextArray[category[0].context]}</span>}
                                actAsExpander={true}
                                showExpandableButton={true}
                                avatar={typeArray[category[0].context]}/>
                              <CardText expandable={true}>
                                <List>
                                {
                                  category.map(function (elem) {
                                    switch (elem.type) {
                                      case "image":
                                        return (
                                          <ListItem
                                            key={generateRandomKey()}
                                            leftIcon={dataTypeArray[elem.type]}
                                            secondaryText={<p><b>Processed at {new Date(elem.date).toLocaleTimeString()} for the purpose of: {elem.purpose}</b></p>}
                                            rightIconButton={self.generateIconMenu(self, elem)}>
                                            <img key={generateRandomKey()}
                                                 className="img-responsive img-thumbnail"
                                                 src={elem.data} style={{width: "100%"}}
                                                 alt={e.title}/>
                                          </ListItem>
                                        );
                                      case "audio":
                                        return (
                                          <ListItem
                                            key={generateRandomKey()}
                                            leftIcon={dataTypeArray[elem.type]}
                                            secondaryText={<p><b>Processed at {new Date(elem.date).toLocaleTimeString()} for the purpose of: {elem.purpose}</b></p>}
                                            rightIconButton={self.generateIconMenu(self, elem)}>
                                            <audio key={generateRandomKey()} controls style={{width: "100%"}}>
                                              <source src={elem.data}/>
                                            </audio>
                                          </ListItem>
                                        );
                                      case "video":
                                        return (
                                          <ListItem
                                            key={generateRandomKey()}
                                            leftIcon={dataTypeArray[elem.type]}
                                            secondaryText={<p><b>Processed at {new Date(elem.date).toLocaleTimeString()} for the purpose of: {elem.purpose}</b></p>}
                                            rightIconButton={self.generateIconMenu(self, elem)}>
                                            <video className="img-thumbnail"
                                                   controls style={{width: "100%"}}>
                                              <source src={elem.data}/>
                                            </video>
                                          </ListItem>
                                        );
                                      case "location":
                                        return (
                                          <ListItem
                                            key={generateRandomKey()}
                                            leftIcon={dataTypeArray[elem.type]}
                                            secondaryText={<p><b>Processed at {new Date(elem.date).toLocaleTimeString()} for the purpose of: {elem.purpose}</b></p>}
                                            rightIconButton={self.generateIconMenu(self, elem)}>
                                            <Map className="img-thumbnail"
                                                 center={elem.data}
                                                 zoom={18}
                                                 zoomControl={false}
                                                 animate={false}
                                                 dragging={false}
                                                 touchZoom={false}
                                                 doubleClickZoom={false}
                                                 scrollWheelZoom={false}
                                                 boxZoom={false}
                                                 keyboard={false}
                                                 tap={false}>
                                              <TileLayer
                                                url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
                                                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                                              />
                                              <Marker position={elem.data}/>
                                            </Map>
                                          </ListItem>);
                                      default:
                                        return (
                                          <ListItem
                                            key={generateRandomKey()}
                                            leftIcon={dataTypeArray[elem.type]}
                                            secondaryText={<p><b>Processed at {new Date(elem.date).toLocaleTimeString()} for the purpose of: {elem.purpose}</b></p>}
                                            rightIconButton={self.generateIconMenu(self, elem)}>
                                              {elem.data}
                                          </ListItem>
                                        );
                                    }
                                  })
                                }
                                </List>
                              </CardText>
                            </Card>
                          );
                        })
                    }
                  </TimelineEvent>
                );
              }.bind(null, this))
            }
            <MessageDialog
              messageOpen={this.state.messageOpen}
              text={this.state.text}
              handleMessageDialoge={this.handleMessageDialog} />
          </Timeline>
          <div style={{textAlign: "center", marginBottom: "20px"}}>
            <RaisedButton
              primary={true}
              label="Load more"
              onClick={this.props.loadMore} />
          </div>
        </div>
      );
    }
  }
}

export default DataTimeline;

// https://stackoverflow.com/a/34890276
function groupBy(xs, key) {
  return xs.reduce(function (rv, x) {
    let v = key instanceof Function ? key(x) : x[key];
    let el = rv.find((r) => r && r.key === v);
    if (el) {
      el.values.push(x);
    } else {
      rv.push({key: v, values: [x]});
    }
    return rv;
  }, []);
}

// https://stackoverflow.com/a/27747377
function dec2hex(dec) {
  return ("0" + dec.toString(16)).substr(-2);
}

function generateRandomKey() {
  var arr = new Uint8Array((12 || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}