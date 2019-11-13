import React, {Component} from 'react';
import {List, ListItem} from 'material-ui/List';
import Subheader from 'material-ui/Subheader';

import theme from "../data/controller.json";
import PrivacyPolicyDialog from "../dialogs/PrivacyPolicyDialog";

import Email from 'material-ui/svg-icons/communication/email';
import BusinessCenter from 'material-ui/svg-icons/places/business-center';
import ImageEdit from 'material-ui/svg-icons/image/edit';



class ControllerInfo extends Component {

  state = {
    policyOpen: false,
  };

  togglePolicy = () => {
    this.setState({policyOpen: !this.state.policyOpen});
  };

  redirect = () => {
    window.location.hash = "#consent";
  };

  emailRedirect = () => {
    window.location = "mailto:privacy@tu-berlin.de"
  };

  render() {
    return (
      <div>
        <List>
          <Subheader>Logo:</Subheader>
          <ListItem style={{textAlign: "center"}}><img src={theme.controller.logo} alt=""/></ListItem>
          <Subheader>Name:</Subheader>
          <ListItem primaryText={theme.controller.name}/>
          <Subheader>Address:</Subheader>
          <ListItem primaryText={<span>{theme.controller.address}</span>}/>
          <Subheader>Email address:</Subheader>
          <ListItem primaryText="privacy@tu-berlin.de" onClick={this.emailRedirect} leftIcon={<Email color={theme.palette.primary1Color}/>}/>
          <Subheader>Privacy policy:</Subheader>
          <ListItem primaryText="Privacy policy" onClick={this.togglePolicy} leftIcon={<BusinessCenter color={theme.palette.primary1Color}/>}/>
          <Subheader>Review consent:</Subheader>
          <ListItem primaryText="Review consent" onClick={this.redirect} leftIcon={<ImageEdit color={theme.palette.primary1Color}/>}/>

        </List>
        <PrivacyPolicyDialog
          policyOpen={this.state.policyOpen}
          togglePolicy={this.togglePolicy}
        />
      </div>
    );
  }

}

export default ControllerInfo;