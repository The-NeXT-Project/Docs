import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: 'Multiple Payment Methods',
    description: (
      <>
        Integrate multiple payment systems such as Alipay F2F, PayPal, Stripe, etc.
      </>
    ),
  },
  {
    title: 'Built-in Email Queue',
    description: (
      <>
        Support multiple mail services, built-in mail queue function, no third-party components are required to use.
      </>
    ),
  },
  {
    title: 'Rich Proxy Protocols Support',
    description: (
      <>
        Support Shadowsocks 2022, TUIC, and other latest proxy protocols.
      </>
    ),
  },
  {
    title: 'Universal Subscription',
    description: (
      <>
        Universal subscription interface, one-click json/clash/sip008/sing-box format subscription distribution.
      </>
    ),
  },
  {
    title: 'Custom Config',
    description: (
      <>
        Custom node configuration, modular subscription system, support multiple client-specific subscription formats.
      </>
    ),
  },
  {
    title: 'AI Integration',
    description: (
      <>
        One-click access to OpenAI, Google AI, Vertex AI, Hugging Face Hosted API, Cloudflare Workers AI, Anthropic, and other large language model services.
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
