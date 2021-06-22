import { Layout, Menu, Breadcrumb } from "antd";
import { Link, withRouter } from "react-router-dom";
import { connect } from "react-redux";
import * as actions from "../store/actions/auth";

const { Header, Content, Footer } = Layout;

function MyLayout(props) {
  return (
    <Layout className="layout">
      <Header>
        <div className="logo" />
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={["2"]}
          style={{ lineHeight: "64px" }}
        >
          {props.isAuthenticated ? (
            <>
              <Menu.Item key="2" onClick={props.logout}>
                Logout
              </Menu.Item>
              <Menu.Item key="3">
                <Link to={`/profile/${props.user_id}`}>My profile</Link>
              </Menu.Item>
            </>
          ) : (
            <Menu.Item key="2">
              <Link to="/login">Login</Link>
            </Menu.Item>
          )}
          <Menu.Item key="1">
            <Link to="/">Quizes</Link>
          </Menu.Item>
        </Menu>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div className="mt-4">
          {" "}
          <div className="site-layout-content">{props.children}</div>
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Nurbek Taizhanov ©2021 Created by Nurbek Corp.
      </Footer>
    </Layout>
  );
}
const mapStateToProps = (state) => {
  return {
    user_id: state.user_id,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(actions.logout()),
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MyLayout)
);
