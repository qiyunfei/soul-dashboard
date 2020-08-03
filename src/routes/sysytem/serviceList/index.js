import React, {Component} from "react";
import {Col, Row, Table} from "antd";
import {connect} from "dva";

@connect(({serviceList, global, loading}) => ({
  ...global,
  ...serviceList,
  loading: loading.effects["global/fetchPlatform"]
}))
export default class ServiceList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      popup: ""
    };
  }

  componentDidMount() {
    this.getAllServices(1);
  }

  getAllServices = () => {
    const {dispatch} = this.props;
    dispatch({
      type: "serviceList/fetchService",
      payload: {}
    });
  };

  getAllServiceLists = () => {
    const {dispatch, currentService} = this.props;
    const appName = currentService ? currentService.appName : "";
    dispatch({
      type: "serviceList/fetchServiceList",
      payload: {
        appName
      }
    });
  };

  pageServiceChange = () => {
    const {plugins} = this.props;
    this.setState({});
    this.getAllServices(plugins);
  };

  pageServiceListChange = () => {
    this.setState({});
    this.getAllServiceLists();
  };

  // 点击选择器
  rowClick = record => {
    const {appName} = record;
    const {dispatch} = this.props;
    dispatch({
      type: "serviceList/saveCurrentService",
      payload: {
        currentService: record
      }
    });
    dispatch({
      type: "serviceList/fetchServiceList",
      payload: {
        appName
      }
    });
  };

  render() {
    const {popup} = this.state;
    const {
      serviceList,
      serviceListList,
      currentService
    } = this.props;
    const serviceColumns = [
      {
        align: "center",
        title: "服务名称",
        dataIndex: "appName",
        key: "appName"
      },
      {
        align: "center",
        title: "服务根路径",
        dataIndex: "path",
        key: "path"
      },
      {
        align: "center",
        title: "服务类型",
        dataIndex: "rpcType",
        key: "rpcType"
      }
    ];

    const serviceListColumns = [
      {
        align: "center",
        title: "服务名称",
        dataIndex: "appName",
        key: "appName"
      },
      {
        align: "center",
        title: "服务地址",
        dataIndex: "address",
        key: "address"
      }
    ];

    return (
      <div className="plug-content-wrap">
        <Row gutter={20}>
          <Col span={12}>
            <div className="table-header">
              <h3>服务列表</h3>
            </div>
            <Table
              size="small"
              onRow={record => {
                return {
                  onClick: () => {
                    this.rowClick(record);
                  }
                };
              }}
              style={{marginTop: 30}}
              bordered
              columns={serviceColumns}
              dataSource={serviceList}
              pagination={{
                pageSize: 20,
                onChange: this.pageServiceChange
              }}
              rowClassName={item => {
                if (currentService && currentService.appName === item.appName) {
                  return "table-selected";
                } else {
                  return "";
                }
              }}
            />
          </Col>
          <Col span={12}>
            <div className="table-header">
              <div style={{display: "flex"}}>
                <h3 style={{marginRight: 30}}>服务地址列表</h3>
              </div>
            </div>
            <Table
              size="small"
              style={{marginTop: 30}}
              bordered
              columns={serviceListColumns}
              dataSource={serviceListList}
              pagination={{
                pageSize: 10000,
                onChange: this.pageServiceListChange
              }}
            />
          </Col>
        </Row>
        {popup}
      </div>
    );
  }
}
