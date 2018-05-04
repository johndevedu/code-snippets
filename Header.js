import React from "react";
import { Redirect } from "react-router-dom";
import * as UsersService from "../services/users.service";
import NotificationsCenter from "./NotificationsCenter";
import ReduxDemoDropdown from "../containers/ReduxDemoDropdown";
import Notifier from "../helpers/notifier";
import { withRouter } from "react-router";
import * as notificationLogServices from "../services/notifications-log.service";
import NotificationModal from "../containers/NotificationModal";
import UserChat from "./UserChatDropdown";
import Logo from "../images/poordawg-white.header.png";
import "./header.css";

class Header extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      logoutSuccessful: false,
      showNotifications: false,
      notifications: [],
      showNotificationModal: false,
      isNotificationVisible: false,
      newNotification: {},
      isReduxDemoVisible: false,
      latestMessage: null
    };

    this.logoutRedirector = this.logoutRedirector.bind(this);
    this.notificationCenterButtonHandler = this.notificationCenterButtonHandler.bind(
      this
    );
    this.handleOutsideClick = this.handleOutsideClick.bind(this);

  }

  componentWillMount() {
    // ....
  }

  logoutRedirector() {
    UsersService.logout()
      .then(data => {
        localStorage.clear();
        this.setState({ logoutSuccessful: data.isSuccessful });
        Notifier.notify({
          title: "Logout Successful!",
          autoDismiss: 2,
          level: "success",
          position: "tr",
          dismissible: "button"
        });
      })
      .catch(err => {
        console.log(err);
        Notifier.notify({
          title: "Logout Failed",
          autoDismiss: 2,
          level: "error",
          position: "tr",
          dismissible: "button"
        });
      });
  }

  notificationCenterButtonHandler() {
    document.addEventListener("click", this.handleOutsideClick, false);

    this.setState(prevState => {
      let isNotificationVisible = !prevState.isNotificationVisible;
      return { isNotificationVisible };
    });
    this.setState({ isNotificationVisible: true });
  }

  handleOutsideClick(e) {
    if (this.node.contains(e.target)) {
      return;
    } else {
      this.closeNotifications();
    }
  }
  closeNotifications() {
    document.removeEventListener("click", this.handleOutsideClick, false);
    this.setState({ isNotificationVisible: false });
  }

  render() {
    if (this.redirectInProgress) return null;

    return (
      <React.Fragment>

        {this.state.logoutSuccessful && <Redirect to="/auth/login" />}
        <header id="header">
          <div
            id="logo-group"
            ref={node => {
              this.node = node;
            }}
          >
      

            <div id="logout" className="btn-header transparent pull-right">
              <span>
                {" "}
                <a title="Sign Out" onClick={this.logoutRedirector}>
                  <i className="fa fa-sign-out" />
                </a>{" "}
              </span>
            </div>

          </div>
        </header>
      </React.Fragment>
    );
  }
}

export default withRouter(Header);
