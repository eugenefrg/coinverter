import {
  Button,
  Card,
  Col,
  Input,
  InputNumber,
  Layout,
  Modal,
  Row,
  Space,
  Typography,
} from "antd";
import type { NextPage } from "next";
import Head from "next/head";
import styles from "../styles/Home.module.css";
import "antd/dist/antd.css";
import { useState } from "react";

const Home: NextPage = () => {
  const [nepValue, setNepValue] = useState<number>();
  const [busdValue, setBusdValue] = useState<number>();

  const [visible, setVisible] = useState<boolean>(false);

  const handleNepCoinChange = (value: number) => {
    setNepValue(value);
    setBusdValue(value * 3);
  };

  const handleBusdCoinChange = (value: number) => {
    setBusdValue(value);
    setNepValue(value / 3);
  };

  /**
   * TODO:
   * Styling, change coin logo. also add the logo to the coin names maybe ??
   */
  return (
    <div>
      <Head>
        <title>Coinverter</title>
        <meta name="description" content="See how much your coin is worth 👀" />
        {/* 
          TODO:
          Change this to a favicon of a coin 
        */}
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Layout className={styles.layout}>
        <Layout.Content>
          <Row className={styles.layout} align="middle">
            <Col span={12} offset={6}>
              <Row>
                <Col span={24}>
                  <Typography.Title level={1} className={styles.centered}>
                    Coinverter
                  </Typography.Title>
                  <Typography.Title level={3} className={styles.centered}>
                    See how much your coin is worth 👀
                  </Typography.Title>
                </Col>
              </Row>
              <Row>
                <Col span={24}>
                  <Card className={styles.justifyContentCenter}>
                    <Space direction="vertical" size="large">
                      <Space>
                        <Space direction="vertical" size={4}>
                          <Typography.Title
                            level={4}
                            className={styles.coinName}
                          >
                            NEP
                          </Typography.Title>
                          <Typography.Text>1=3BUSD</Typography.Text>
                        </Space>
                        <InputNumber
                          name="nepCoin"
                          onChange={handleNepCoinChange}
                          value={nepValue}
                          precision={2}
                          controls={false}
                        />
                        <Typography.Text>X</Typography.Text>
                        <InputNumber
                          name="busdCoin"
                          onChange={handleBusdCoinChange}
                          value={busdValue}
                          precision={2}
                          controls={false}
                        />
                        <Space direction="vertical" size={4}>
                          <Typography.Title
                            level={4}
                            className={styles.coinName}
                          >
                            BUSD
                          </Typography.Title>
                          <Typography.Text>1=3BUSD</Typography.Text>
                        </Space>
                      </Space>
                      <div className={styles.justifyContentCenter}>
                        <Button type="ghost" onClick={() => setVisible(true)}>
                          Connect to your wallet
                        </Button>
                      </div>
                    </Space>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
      <Modal
        title="How to use Coinverter"
        visible={visible}
        onOk={() => setVisible(false)}
        onCancel={() => setVisible(false)}
      >
        <Typography.Title>Modal</Typography.Title>
        <Typography.Text>
          This is a modal. You can use this to display information to the user.
        </Typography.Text>
      </Modal>
    </div>
  );
};

export default Home;
