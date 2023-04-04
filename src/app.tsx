import Footer from '@/components/Footer';
import RightContent from '@/components/RightContent';
import { BookOutlined, LinkOutlined } from '@ant-design/icons';

import { PageLoading, SettingDrawer } from '@ant-design/pro-components';
import type { RunTimeLayoutConfig } from 'umi';
import { history, Link } from 'umi';
import defaultSettings from '../config/defaultSettings';
import { currentUser as queryCurrentUser } from './services/ant-design-pro/api';

const isDev = process.env.NODE_ENV === 'development';

// 白名单
// 定义一个白名单，白名单里面的路由可以不需要登陆也可以进入
// 一个是注册页面，一个是登陆页面
const NO_LOGIN_WHITE_LIST=['/user/register','/user/login'];

/** 获取用户信息比较慢的时候会展示一个 loading */
export const initialStateConfig = {
  loading: <PageLoading />,
};
console.log(process.env.NODE_ENV )
/**
 * @see  https://umijs.org/zh-CN/plugins/plugin-initial-state
 * */
export async function getInitialState(): Promise<{ fetchUserInfo: () => Promise<API.BaseResponse<API.CurrentUser> | undefined>; settings: PureSettings & RenderSetting & { pwa?: boolean; logo?: string }; currentUser: API.BaseResponse<API.CurrentUser> | undefined }> {
  // 获取用户信息
  const fetchUserInfo = async () => {
    try {
      const msg = await queryCurrentUser();
      console.log(msg)
      return msg;
    } catch (error) {
      history.push('/user/login');
    }
    return undefined;
  };
  // 判断目标是否为白名单页面
  // 不需要查询用户存在性也能进入白名单
  if (NO_LOGIN_WHITE_LIST.includes(history.location.pathname)) {
    return {
      currentUser: undefined,
      fetchUserInfo,
      settings: defaultSettings
    };
  }
  // 查询用户是否存在，并返回用户数据 currentUser
  const currentUser = await fetchUserInfo();
  return {
    fetchUserInfo,
    currentUser,
    settings: defaultSettings,
  };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
// @ts-ignore
export const layout: RunTimeLayoutConfig = ({ initialState, setInitialState }) => {
  return {
    rightContentRender: () => <RightContent />,
    disableContentMargin: false,
    waterMarkProps: {
      content: initialState?.currentUser?.username,
    },
    footerRender: () => <Footer />,
    // 页面重定向
    //如果用户已登录则进入路由，未登录则重定向到登陆页面login
    onPageChange: () => {
      const { location } = history;
      if (NO_LOGIN_WHITE_LIST.includes(location.pathname)){
        return;
      }
      // 如果没有登录，重定向到 login
      if (!initialState?.currentUser) {
        history.push('/user/login');
      }
    },
    links: isDev
      ? [
          <Link key="openapi" to="/umi/plugin/openapi" target="_blank">
            <LinkOutlined />
            <span>OpenAPI 文档</span>
          </Link>,
          <Link to="/~docs" key="docs">
            <BookOutlined />
            <span>业务组件文档</span>
          </Link>,
        ]
      : [],
    menuHeaderRender: undefined,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
    // 增加一个 loading 的状态
    childrenRender: (children, props) => {
      // if (initialState?.loading) return <PageLoading />;
      return (
        <>
          {children}
          {!props.location?.pathname?.includes('/login') && (
            <SettingDrawer
              disableUrlParams
              enableDarkTheme
              settings={initialState?.settings}
              onSettingChange={(settings) => {
                setInitialState((preInitialState) => ({
                  ...preInitialState,
                  settings,
                }));
              }}
            />
          )}
        </>
      );
    },
    ...initialState?.settings,
  };
};
