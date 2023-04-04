import Footer from '@/components/Footer';
import { register} from '@/services/ant-design-pro/api';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { Alert, message, Tabs } from 'antd';
import React, { useState } from 'react';
import { FormattedMessage, history, SelectLang, useIntl, useModel } from 'umi';
import styles from './index.less';
// 自己引入的图标logo
import {JACKDAW_BAOTA,  SYSTEM_LOGO} from '@/constants';


const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => (
  <Alert
    style={{
      marginBottom: 24,
    }}
    message={content}
    type="error"
    showIcon
  />
);

const Register: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const [type, setType] = useState<string>('account');
  const { initialState, setInitialState } = useModel('@@initialState');

  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      await setInitialState((s) => ({
        ...s,
        currentUser: userInfo,
      }));
    }
  };

  const handleSubmit = async (values: API.RegisterParams) => {
    const { userPassword,checkPassword }=values;
    // 校验
    if (userPassword!=checkPassword){
      message.error("两次输入不一致");
      return;
    }
    try {
      // 注册
      // 返回值是新注册的用户id
      const msg = await register( values);
      console.log(msg)
      // 判断注册成功的条件：id是否为空
      // @ts-ignore
      if (msg>0) {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.register.success',
          defaultMessage: '注册成功！',
        });
        // 甚至用户状态为当前用户
        // @ts-ignore
        setUserLoginState(msg);

        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        /** 此方法会跳转到 redirect 参数所在的位置 */
       /** 注册成功后跳转到y原来的页面 **/
        if (!history) return;
        const { query } = history.location;
        // redirect用于保存登录拦截之前的地址
        // const { redirect } = query as { redirect: string };
        // history.push('/user/login?redirect='+redirect);
        history.push({
          pathname: '/login',
          query,
        });
        return;
      }

    }
    catch (error:any) {
      // const defaultLoginFailureMessage = intl.formatMessage({
      //   id: 'pages.login.failure',
      //   defaultMessage: '注册失败，请重试！',
      // });
      // message.error(error.message?? defaultLoginFailureMessage);
     }
  };
  const { status, type: loginType } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.lang} data-lang>
        {SelectLang && <SelectLang />}
      </div>
      <div className={styles.content}>
        <LoginForm
          submitter={
            {
              searchConfig:{
                submitText:'注册'
              }
            }
          }
          logo={<img alt="logo" src={SYSTEM_LOGO} />}
          title="用户中心注册"
          subTitle={ <a href={JACKDAW_BAOTA}>jadw自己的个人作品</a> }
          initialValues={{
            autoLogin: true,
          }}

          /*
          表单提交时的操作
          */
          onFinish={async (values) => {
            await handleSubmit(values as API.RegisterParams);
          }}
        >
          <Tabs activeKey={type} onChange={setType}>
            <Tabs.TabPane
              key="account"
              tab={intl.formatMessage({
                id: 'pages.login.accountLogin.tab',
                defaultMessage: '注册',
              })}
            />
          </Tabs>

          {status === 'error' && loginType === 'account' && (
            <LoginMessage
              content={intl.formatMessage({
                id: 'pages.login.accountLogin.errorMessage',
                defaultMessage: '账户或密码错误(admin/ant.design)',
              })}
            />
          )}
          {type === 'account' && (
            <>
              <ProFormText
                  name="userAccount"
                fieldProps={{
                  size: 'large',
                  prefix: <UserOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.username.placeholder',
                  defaultMessage: '用户名: admin or user',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.username.required"
                        defaultMessage="请输入用户名!"
                      />
                    ),
                  },
                ]}
              />
              <ProFormText.Password
                name="userPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="请输入密码！"
                      />
                    ),
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不可以少于8位啊啊啊啊啊啊啊'
                  }
                ]}
              />
              <ProFormText.Password
                name="checkPassword"
                fieldProps={{
                  size: 'large',
                  prefix: <LockOutlined className={styles.prefixIcon} />,
                }}
                placeholder={intl.formatMessage({
                  id: 'pages.login.password.placeholder',
                  defaultMessage: '密码: ant.design',
                })}
                rules={[
                  {
                    required: true,
                    message: (
                      <FormattedMessage
                        id="pages.login.password.required"
                        defaultMessage="再次确认密码！"
                      />
                    ),
                  },
                  {
                    min: 8,
                    type: 'string',
                    message: '密码不可以少于8位啊啊啊啊啊啊啊'
                  }
                ]}
              />
            </>
          )}

          {status === 'error' && loginType === 'mobile' && <LoginMessage content="验证码错误" />}
          {/*{type === 'mobile' && (*/}
          {/*  <>*/}
          {/*    <ProFormText*/}
          {/*      fieldProps={{*/}
          {/*        size: 'large',*/}
          {/*        prefix: <MobileOutlined className={styles.prefixIcon} />,*/}
          {/*      }}*/}
          {/*      name="mobile"*/}
          {/*      placeholder={intl.formatMessage({*/}
          {/*        id: 'pages.login.phoneNumber.placeholder',*/}
          {/*        defaultMessage: '手机号',*/}
          {/*      })}*/}
          {/*      rules={[*/}
          {/*        {*/}
          {/*          required: true,*/}
          {/*          message: (*/}
          {/*            <FormattedMessage*/}
          {/*              id="pages.login.phoneNumber.required"*/}
          {/*              defaultMessage="请输入手机号！"*/}
          {/*            />*/}
          {/*          ),*/}
          {/*        },*/}
          {/*        {*/}
          {/*          pattern: /^1\d{10}$/,*/}
          {/*          message: (*/}
          {/*            <FormattedMessage*/}
          {/*              id="pages.login.phoneNumber.invalid"*/}
          {/*              defaultMessage="手机号格式错误！"*/}
          {/*            />*/}
          {/*          ),*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*    />*/}
          {/*    <ProFormCaptcha*/}
          {/*      fieldProps={{*/}
          {/*        size: 'large',*/}
          {/*        prefix: <LockOutlined className={styles.prefixIcon} />,*/}
          {/*      }}*/}
          {/*      captchaProps={{*/}
          {/*        size: 'large',*/}
          {/*      }}*/}
          {/*      placeholder={intl.formatMessage({*/}
          {/*        id: 'pages.login.captcha.placeholder',*/}
          {/*        defaultMessage: '请输入验证码',*/}
          {/*      })}*/}
          {/*      captchaTextRender={(timing, count) => {*/}
          {/*        if (timing) {*/}
          {/*          return `${count} ${intl.formatMessage({*/}
          {/*            id: 'pages.getCaptchaSecondText',*/}
          {/*            defaultMessage: '获取验证码',*/}
          {/*          })}`;*/}
          {/*        }*/}
          {/*        return intl.formatMessage({*/}
          {/*          id: 'pages.login.phoneLogin.getVerificationCode',*/}
          {/*          defaultMessage: '获取验证码',*/}
          {/*        });*/}
          {/*      }}*/}
          {/*      name="captcha"*/}
          {/*      rules={[*/}
          {/*        {*/}
          {/*          required: true,*/}
          {/*          message: (*/}
          {/*            <FormattedMessage*/}
          {/*              id="pages.login.captcha.required"*/}
          {/*              defaultMessage="请输入验证码！"*/}
          {/*            />*/}
          {/*          ),*/}
          {/*        },*/}
          {/*      ]}*/}
          {/*      onGetCaptcha={async (phone) => {*/}
          {/*        const result = await getFakeCaptcha({*/}
          {/*          phone,*/}
          {/*        });*/}
          {/*        if (result === false) {*/}
          {/*          return;*/}
          {/*        }*/}
          {/*        message.success('获取验证码成功！验证码为：1234');*/}
          {/*      }}*/}
          {/*    />*/}
          {/*  </>*/}
          {/*)}*/}
          <div
            style={{
              marginBottom: 24,
            }}
          >
          </div>
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
