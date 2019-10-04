import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';

import { toastSuccess, toastError } from '../../../util/apiNotification';

import PasswordResetModal from './PasswordResetModal';
import PaginationWrapper from '../../PaginationWrapper';
import InviteUserControl from './InviteUserControl';
import UserTable from './UserTable';

import { createSubscribedElement } from '../../UnstatedUtils';
import AppContainer from '../../../services/AppContainer';

class UserPage extends React.Component {

  constructor(props) {
    super();

    this.state = {
      userForPasswordResetModal: null,
      users: [],
      activePage: 1,
      pagingLimit: Infinity,
      isPasswordResetModalShown: false,
    };

    this.removeUser = this.removeUser.bind(this);
    this.showPasswordResetModal = this.showPasswordResetModal.bind(this);
    this.hidePasswordResetModal = this.hidePasswordResetModal.bind(this);
  }

  // TODO unstatedContainerを作ってそこにリファクタすべき
  componentDidMount() {
    const data = document.getElementById('admin-user-page');
    const users = JSON.parse(data.getAttribute('users'));

    this.setState({
      users,
    });
  }

  async removeUser(user) {

    const { appContainer } = this.props;

    try {
      const response = await appContainer.apiv3.delete(`/users/${user._id}/remove`);
      const { username } = response.data.userData;
      toastSuccess(`Delete ${username} success`);
    }
    catch (err) {
      toastError(err);
    }
  }

  /**
   * passwordリセットモーダルが開き、userが渡される
   * @param {object} user
   *
   */
  showPasswordResetModal(user) {
    this.setState({
      isPasswordResetModalShown: true,
      userForPasswordResetModal: user,
    });
  }

  hidePasswordResetModal() {
    this.setState({ isPasswordResetModalShown: false });
  }


  render() {
    const { t } = this.props;

    return (
      <Fragment>
        { this.state.userForPasswordResetModal && (
          <PasswordResetModal
            user={this.state.userForPasswordResetModal}
            show={this.state.isPasswordResetModalShown}
            onHideModal={this.hidePasswordResetModal}
          />
        ) }
        <p>
          <InviteUserControl />
          <a className="btn btn-default btn-outline ml-2" href="/admin/users/external-accounts">
            <i className="icon-user-follow" aria-hidden="true"></i>
            { t('user_management.external_account') }
          </a>
        </p>
        <UserTable
          users={this.state.users}
          onPasswordResetClicked={this.showPasswordResetModal}
          removeUser={this.removeUser}
        />
        <PaginationWrapper
          activePage={this.state.activePage}
          changePage={this.handlePage} // / TODO GW-314 create function
          totalItemsCount={this.state.users.length} // TODO GW-314 props.userTotalCount
          pagingLimit={this.state.pagingLimit}
        />
      </Fragment>
    );
  }

}

const UserPageWrapper = (props) => {
  return createSubscribedElement(UserPage, props, [AppContainer]);
};

UserPage.propTypes = {
  t: PropTypes.func.isRequired, // i18next
  appContainer: PropTypes.instanceOf(AppContainer).isRequired,

};

export default withTranslation()(UserPageWrapper);
