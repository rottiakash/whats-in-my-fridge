import React, { FC } from "react";
import { Collapse, List } from "antd";
import "./Result.css";
const { Panel } = Collapse;
interface ResultProps {
  score: Array<{
    name: string;
    url: string;
    score: number;
    missing: Array<string>;
  }>;
}

const Result: FC<ResultProps> = ({ score }) => {
  return (
    <div>
      <h1>The Recipies are:</h1>
      <Collapse accordion bordered={false}>
        {score.map((item) => (
          <Panel header={item.name} key={item.url}>
            URL: <a href={item.url}>{item.url}</a>
            <List
              size="small"
              header={<div>Missing Items</div>}
              bordered
              dataSource={item.missing}
              renderItem={(item) => <List.Item>{item}</List.Item>}
            />
          </Panel>
        ))}
      </Collapse>
    </div>
  );
};

export default Result;
