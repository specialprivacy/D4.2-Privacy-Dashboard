import React, {Component} from 'react';
import './styles/App.css';
import FilterControls from './controls/FilterControls';
import DataTimelineContainer from './timeline/DataTimelineContainer';
import MessageSection from './dialogs/MessageSectionDialog';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import AppBar from 'material-ui/AppBar';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import Drawer from 'material-ui/Drawer';
import Badge from 'material-ui/Badge';

import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AccountCircle from 'material-ui/svg-icons/action/account-circle';
import Settings from 'material-ui/svg-icons/action/settings';
import DirectionsRun from 'material-ui/svg-icons/maps/directions-run';
import CommunicationEmail from 'material-ui/svg-icons/communication/email';

import getMuiTheme from "material-ui/styles/getMuiTheme";
import theme from "./data/controller.json";
import PricingTable from "./consent/PricingTable";
import CustomConsent from "./consent/CustomConsent";

const muiTheme = getMuiTheme(theme);

class App extends Component {

  state = {
    open: false,

    controls: {
      // processing context
      intentionalChecked: true,
      incidentalChecked: true,
      behavioralChecked: true,
      derivedChecked: true,

      // data types
      textChecked: true,
      imageChecked: true,
      audioChecked: true,
      videoChecked: true,
      locationChecked: true,

      // time range
      from: 0,
      to: 1509494399000,
    },

    numberMessages: 0,
    showMessageBadge: false,
    messageSectionOpen: false
  };

  componentDidMount() {
    const self = this;

    window.onhashchange = function () {
      self.forceUpdate();
    }
  }

  handleToggle = () => this.setState({open: !this.state.open});

  toggleChecked = (isInputChecked, newState, event) => {
    this.setState({controls: Object.assign(this.state.controls, newState.controls)});
    this.forceUpdate();
  };

  setTimerange = (event, origin, e, newDate) => {
    if (origin < 1) {
      this.setState({controls: Object.assign(this.state.controls, {from: Date.parse(newDate)})});
    } else {
      this.setState({controls: Object.assign(this.state.controls, {to: Date.parse(newDate)})});
    }
    this.forceUpdate();
  };

  toggleMessageSectionOpen = () => {
    this.setState({messageSectionOpen: !this.state.messageSectionOpen});
  };

  render() {
    var content = <DataTimelineContainer
      controls={this.state.controls}
      toggleChecked={this.toggleChecked}
      setTimerange={this.setTimerange}
    />;

    if (window.location.hash === "#timeline") {
      content = <DataTimelineContainer controls={this.state.controls}/>;
    } else if (window.location.hash === "#consent") {
      content = <PricingTable/>;
    } else if (window.location.hash === "#custom-consent") {
      content = <CustomConsent/>;
    } else if (window.location.hash === "#privacy-policy") {
      content = <div>privacy policy</div>;
    }

    const iconMenu = <div>
      <Badge
        badgeContent={this.state.numberMessages}
        secondary={true}
        badgeStyle={{top: -4, right: -4, zIndex: 9}}
        style={{padding: 0, display: (this.state.showMessageBadge) ? "inline-block" : "none"}}
      >
        <IconButton
          iconStyle={{color: "white"}}
          onClick={this.toggleMessageSectionOpen}
        >
          <CommunicationEmail/>
        </IconButton>
      </Badge>
      <IconButton
        iconStyle={{color: "white"}}
        style={{display: (this.state.showMessageBadge) ? "none" : "inline-block"}}
        onClick={this.toggleMessageSectionOpen}
      >
        <CommunicationEmail/>
      </IconButton>
      <IconMenu
        iconButtonElement={<IconButton iconStyle={{color: "white"}}><MoreVertIcon/></IconButton>}
        targetOrigin={{horizontal: 'right', vertical: 'top'}}
        anchorOrigin={{horizontal: 'right', vertical: 'top'}}
      >
        <MenuItem leftIcon={<AccountCircle/>}>My profile</MenuItem>
        <MenuItem leftIcon={<Settings/>}>Settings</MenuItem>
        <MenuItem leftIcon={<DirectionsRun/>}>Logout</MenuItem>
      </IconMenu>
    </div>;

    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div className="container-fluid">
          <div className="row">
            <AppBar
              title={<a href="/LNDW18" style={{color: "white", textDecoration: "none"}}>SPECIAL privacy dashboard</a>}
              className="hidden-xs hidden-sm"
              showMenuIconButton={false}
              style={{display: "flex"}}
              iconElementRight={iconMenu}
            />
            <AppBar
              title={<a href="/LNDW18" style={{color: "white", textDecoration: "none"}}>SPECIAL privacy dashboard</a>}
              className="hidden-md hidden-lg"
              showMenuIconButton={true}
              style={{display: "flex"}}
              iconElementRight={iconMenu}
              onLeftIconButtonTouchTap={this.handleToggle}
            >
              <Drawer open={this.state.open} width="75%">
                <AppBar
                  title={<a href="/LNDW18" style={{color: "white", textDecoration: "none"}}>SPECIAL privacy dashboard</a>}
                  className="hidden-md hidden-lg"
                  showMenuIconButton={true}
                  style={{display: "flex"}}
                  onLeftIconButtonTouchTap={this.handleToggle}
                />
                <FilterControls
                  controls={this.state.controls}
                  toggleChecked={this.toggleChecked}
                  setTimerange={this.setTimerange}
                />
              </Drawer>
            </AppBar>
            <MessageSection
              messageSectionOpen={this.state.messageSectionOpen}
              toggleMessageSectionOpen={this.toggleMessageSectionOpen}
            />
          </div>
          {content}
        </div>
      </MuiThemeProvider>
    );
  }
}

export default App;