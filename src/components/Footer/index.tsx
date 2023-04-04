import { GithubOutlined } from '@ant-design/icons';
import { DefaultFooter } from '@ant-design/pro-components';
import { useIntl } from 'umi';
import {JACKDAW_BAOTA, JACKDAW_GITHUB} from "@/constants";

const Footer: React.FC = () => {
  useIntl();
  const defaultMessage = 'Jackdaw制作';

  const currentYear = new Date().getFullYear();

  return (
    <DefaultFooter
      copyright={`${currentYear} ${defaultMessage}`}
      links={[
        {
          key: '宝塔模板',
          title: '宝塔模板',
          href: JACKDAW_BAOTA,
          blankTarget: true,
        },
        {
          key: 'JACKDAW的github',
          title: <GithubOutlined />,
          href: JACKDAW_GITHUB,
          blankTarget: true,
        },
      ]}
    />
  );
};

export default Footer;
