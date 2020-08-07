import React, { Component } from "react";
import { Table, Input, Button, message,Popconfirm } from "antd";
import { connect } from "dva";
import AddModal from "./AddModal";
import RelateMetadata from "./RelateMetadata"
import AddTable from "./AddTable"
import dayjs from "dayjs";

import SearchContent from "./SearchContent"
@connect(({ auth, loading }) => ({
  auth,
  loading: loading.effects["auth/fetch"]
}))
export default class Auth extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentPage: 1,
      selectedRowKeys: [],
      appKey: "",
      phone: "",
      popup: ""
    };
  }

  componentWillMount() {
    const { currentPage } = this.state;
    this.getAllAuths(currentPage);
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  // 发送请求获取数据

  getAllAuths = page => {
    const { dispatch } = this.props;
    const { appKey,phone } = this.state;
    dispatch({
      type: "auth/fetch",
      payload: {
        appKey,
        phone,
        currentPage: page,
        pageSize: 20
      }
    });
  };

  // 发送请求获取所有元数据信息
  // getAllMetaDel = () => {
  //   const { dispatch } = this.props;
  //   dispatch({
  //     type: "auth/fetchMeta",
  //     payload: {
  //       currentPage: 1,
  //       pageSize: 10
  //     },
  //     callback: datas => datas
  //   })
  // }

  // 分页数据

  pageOnchange = page => {
    this.setState({ currentPage: page });
    this.getAllAuths(page);
  };

  // 关闭弹框

  closeModal = () => {
    console.log("关闭弹窗")
    console.log(this.state.selectedRowKeys)
    this.setState({ popup: "" });
  };

  // 编辑弹框

  editClick = record => {
    const { dispatch } = this.props;
    const { currentPage } = this.state;
    // const authName = this.state.appKey;
    dispatch({
      type: "auth/fetchItem",
      payload: {
        id: record.id
      },
      callback: (auth) => {

        this.setState({
          popup: (
            <AddModal
              {...auth}
              handleOk={values => {
                // const { appKey, appSecret, authParamVOList, enabled, id, phone,userId } = values;
                // 发送更新请求
                dispatch({
                  type: "auth/update",
                  payload: {
                    extInfo:null,
                    ...values
                  },
                  fetchValue: {

                    currentPage,
                    pageSize: 20
                  },
                  callback: () => {
                    this.closeModal();
                  }
                });
              }}
              handleCancel={() => {
                this.closeModal();
              }}
            />
          )
        });
      }
    });
  };

  editClickMeta = record => {
    const { currentPage } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "auth/fetchItemDel",
      payload: {
        id: record.id
      },
      callback: (auth)=>{

        dispatch({
          type: "auth/fetchMeta",
          payload: {
            // currentPage,
            // pageSize: 10
          },
          callback: datas => {
            this.setState({
              popup: (
                <RelateMetadata
                  {...auth}
                  {...datas}
                  authName={ 'appKey:  ' + record.appKey }
                  id={record.id}
                  handleCancel={() => {
                    this.closeModal();
                  }}
                  handleOk={values => {
                    // const { appKey, appSecret, enabled, id, authParamVOList } = values;
                    // 发送更新请求
                    dispatch({
                      type: "auth/updateDel",
                      payload: values,
                      fetchValue: {

                        currentPage,
                        pageSize: 20
                      },
                      callback: () => {
                        this.closeModal();
                      }
                    });
                  }}
                />
              )
            })
          }
        })

      }
    })
  }



  // 点击搜索事件

  searchClick = res => {
    // console.log(res)
    const {dispatch} = this.props;
    dispatch({
      type: "auth/fetch",
      payload: {
        appKey: res.appKey?res.appKey:null,
        phone: res.phone?res.phone:null,
        pageSize: 20,
        currentPage: 1
      }
    })






    this.setState({ currentPage: 1 });
  };

  // 点击删除事件

  deleteClick = () => {
    const { dispatch } = this.props;
    const { selectedRowKeys } = this.state;
    if (selectedRowKeys && selectedRowKeys.length > 0) {
      // 发送删除请求
      dispatch({
        type: "auth/delete",
        payload: {
          list: selectedRowKeys
        },
        fetchValue: {},
        callback: () => {
          this.setState({ selectedRowKeys: [] })
        }
      });
    } else {
      message.destroy();
      message.warn("请选择数据");
    }
  };

  // 添加表格数据事件

  addClick = () => {
    const { currentPage } = this.state;
    const { dispatch } = this.props;
    dispatch({
      type: "auth/fetchMetaGroup",
      payload: {},
      callback: (metaGroup)=>{

        this.setState({
          popup: (
            <AddTable
              metaGroup={metaGroup}
              handleOk={values => {
                // const { appKey, appSecret, enabled } = values;
                // 发送添加请求
                dispatch({
                  type: "auth/add",
                  payload: values,
                  fetchValue: {
                    // appKey: authName,
                    currentPage,
                    pageSize: 20
                  },
                  callback: () => {
                    this.setState({ selectedRowKeys: [] })
                    this.closeModal();
                  }
                });
              }}
              handleCancel={() => {
                this.closeModal();
              }}
            />
          )
        });
      }
    })
  };

  // 批量启用或禁用

  enableClick = () => {
    const {dispatch} = this.props;
    const {selectedRowKeys} = this.state;
    if(selectedRowKeys && selectedRowKeys.length>0) {
      dispatch({
        type: "auth/fetchItem",
        payload: {
          id: selectedRowKeys[0]
        },
        callback: user => {
          dispatch({
            type: "auth/updateEn",
            payload: {
              list: selectedRowKeys,
              enabled: !user.enabled
            },
            fetchValue: {},
            callback: () => {
              this.setState({selectedRowKeys: []});
            }
          })
        }
      })
    } else {
      message.destroy();
      message.warn("请选择数据");
    }
  }

  // 同步数据事件

  syncData = () => {
    const {dispatch} = this.props;
    dispatch({
      type: "auth/syncDa",
      payload: {}
    })
  }

  render() {
    const { auth, loading } = this.props;
    const { authList, total } = auth;
    const { currentPage, selectedRowKeys, appKey,phone, popup } = this.state;
    const authColumns = [
      {
        align: "left",
        title: "appkey",
        dataIndex: "appKey",
        key: "appKey"
      },
      {
        align: "left",
        title: "appSecret",
        dataIndex: "appSecret",
        key: "appSecret"
      },
      {
        align: "left",
        title: "调用方",
        dataIndex: "userId",
        key: "userId"
      },
      {
        align: "left",
        title: "phone",
        dataIndex: "phone",
        key: "phone"
      },

      {
        align: "center",
        title: "状态",
        dataIndex: "enabled",
        key: "enabled",
        render: text => {
          if (text) {
            return <div className="open">开启</div>;
          } else {
            return <div className="close">关闭</div>;
          }
        }
      },
      // {
      //   align: "center",
      //   title: "创建时间",
      //   dataIndex: "dateCreated",
      //   key: "dateCreated"
      // },
      {
        align: "center",
        title: "更新时间",
        dataIndex: "dateUpdated",
        render: dateUpdated => dayjs(dateUpdated).format('YYYY-MM-DD HH:mm:ss' ),
        key: "dateUpdated"
      },
      {
        align: "center",
        title: "操作1",
        dataIndex: "operate",
        key: "operate",
        render: (text, record) => {
          return (
            // 弹窗中的编辑事件
            <div
              className="edit"
              onClick={() => {
                this.editClick(record);
              }}
            >
              编辑
            </div>
          );
        }
      },
      {
        align: "center",
        title: "操作2",
        dataIndex: "operates",
        key: "operates",
        render: (text, record) => {
          return (
            // 弹窗中的编辑事件
            <div
              className="edit"
              onClick={() => {
                this.editClickMeta(record);
              }}
            >
              编辑资源详情
            </div>
          );
        }
      }
    ];

    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange
    };

    return (
      <div className="plug-content-wrap">
        {/* 头部导航栏 */}
        <div style={{ display: "flex",alignItems: 'center' }}>


          {/* 内联查询 */}
          <SearchContent onClick={res=>this.searchClick(res)} />

          {/* 删除勾选按钮 */}
          <Popconfirm
            title="你确认删除吗"
            placement='bottom'
            onConfirm={() => {
              this.deleteClick()
            }}
            okText="确认"
            cancelText="取消"
          >
            <Button
              style={{ marginLeft: 20 }}
              type="danger"
            >
              删除勾选数据
            </Button>
          </Popconfirm>
          {/* 添加数据按钮 */}
          <Button
            style={{ marginLeft: 20 }}
            type="primary"
            onClick={this.addClick}
          >
            添加数据
          </Button>
          {/* 批量启用或禁用按钮 */}
          <Button
            style={{ marginLeft: 20 }}
            type="primary"
            onClick={this.enableClick}
          >
            批量启用或禁用
          </Button>
          {/* 同步数据按钮 */}
          <Button
            style={{ marginLeft: 20 }}
            type="primary"
            onClick={this.syncData}
          >
            同步数据
          </Button>
        </div>
        {/* 表格 */}
        <Table
          size="small"
          style={{ marginTop: 30 }}
          bordered
          rowKey={record => record.id}
          loading={loading}
          columns={authColumns}
          dataSource={authList}
          rowSelection={rowSelection}
          pagination={{
            total,
            current: currentPage,
            pageSize:20,
            onChange: this.pageOnchange
          }}
        />
        {popup}
      </div>
    );
  }
}
