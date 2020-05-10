import RequestReset from '../components/RequestReset';
import PleaseSignIn from '../components/PleaseSignIn';

const AccountPage = () => (
  <div>
    <PleaseSignIn>
      <RequestReset />
    </PleaseSignIn>
  </div>
);

export default AccountPage;
