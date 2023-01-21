import React from "react";
import logo from "../../assests/logo.png";
import "./spacexdashboard.css";
import Spacexfiltervalues from "./Spacex-filter-launches-ui/Spacexfiltervalues";
import { Table, Badge } from "antd";
import { useState } from "react";
import axios from "axios";
import { useEffect } from "react";
import { Button, Modal, ModalTitle } from "react-bootstrap";
import rocket from "../../assests/spacerocket.webp";

const Spacexdashboard = () => {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalinfo, setModalInfo] = useState([]);
  const [showModal, setshowModal] = useState(false);
  const [show, setShow] = useState(false);
  const [filterTextValue, setFilterTextValue] = useState("all");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  // console.log(dataSource);

  const sortSpacexValues = (filterTextValue) => {
    try {
      // console.log(filterTextValue,'=========>');
      let url = "https://api.spacexdata.com/v3/launches";
      if (filterTextValue === "failure") {
        //  url = url + '/upcoming';
        url = `${url}/upcoming`;
      }
      axios
        .get(url)
        .then((resp) => {
          // console.log(resp.data);
          setDataSource(resp.data);
          setLoading(false);
        })
        .catch((err) => {
          console.log(err);
        });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    sortSpacexValues(filterTextValue);
  }, [filterTextValue]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    setLoading(true);
    axios
      .get(`https://api.spacexdata.com/v3/launches`)
      .then((resp) => {
        // console.log(resp.data);
        setDataSource(resp.data);
        setLoading(false);
        let myobj = JSON.stringify(resp.data);
        localStorage.setItem("filter", myobj);
        console.log(myobj);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const onfilteredValueSelected = (filterValue) => {
    console.log(filterValue);
    setFilterTextValue(filterValue);
  };
  const coloums = [
    {
      key: "flight_number",
      title: "NO.",
      dataIndex: "flight_number",
    },
    {
      key: "flight_number",
      title: "Launched(UTC)",
      dataIndex: "launch_date_local",
    },
    {
      key: "flight_number",
      title: "Location",
      dataIndex: "launch_site",
      render: (text) => {
        // console.log(text)
        return <a>{text.site_name}</a>;
      },
    },
    { key: "flight_number", title: "Mission", dataIndex: "mission_name" },
    {
      key: "flight_number",
      title: "Orbit",
      dataIndex: "rocket",
      render: (text) => {
        // console.log(text.second_stage.payloads);
        let object = text.second_stage.payloads;

        return (
          <a>
            {object.map((x) => {
              return x.orbit;
            })}
          </a>
        );
      },
    },
    {
      key: "flight_number",
      title: "Launchs",
      dataIndex: "launch_success",
      render: (text) => {
        // console.log(text);
        if (text === true) {
          return <Badge status="success" text="launched" />;
        } else if (text === false) {
          return <Badge status="warning" text="upcoming" />;
        } else {
          return <Badge status="error" text="Failed" />;
        }
      },
      filters: [
        { text: "upcoming", value: "" },
        { text: "success", value: true },
        { text: "failure", value: false },
      ],
    },
    {
      key: "flight_number",
      title: "Rocket",
      dataIndex: "rocket",
      render: (text) => {
        // console.log(text);
        return <a>{text.rocket_name}</a>;
      },
    },
  ];

  const rowEvent = (record, rowIndex) => {
    return {
      onClick: (event) => {
        // console.log(record);
        setModalInfo(record);
        toggleTrueFalse();
        // localStorage.setItem("filter", "123");
      }, // click row
    };
  };
  const toggleTrueFalse = () => {
    setshowModal(handleShow);
  };
  const ModelContent = () => {
    return (
      <Modal show={show} onHide={handleClose} className="modalcontainer">
        <Modal.Header className="modalheader">
          <ModalTitle className="modeltitle">
            <div>
              <img src={rocket} alt="rocket" />
            </div>
            <h5>
              {modalinfo.mission_name} {modalinfo.flight_number}
            </h5>

            <h6>
              {modalinfo.details}{" "}
              <span
                style={{ color: "darkblue", textDecorationLine: "underline" }}
              >
                wikipedia
              </span>
            </h6>
          </ModalTitle>
        </Modal.Header>
        <Modal.Body className="modal-body">
          <pre>
            <h5> Flight Number:          {modalinfo.flight_number}</h5>{" "}
          </pre>
          <pre>
            <h5> Mission Name:           {modalinfo.rocket.rocket_name}</h5>{" "}
          </pre>
          <pre>
            <h5> Rocket Type:            {modalinfo.rocket.rocket_type}</h5>{" "}
          </pre>
          <pre>
            <h5> Manufacturer:           SpaceX</h5>{" "}
          </pre>
          <pre>
            <h5> Payload Type:            {modalinfo.rocket.rocket_name}</h5>{" "}
          </pre>
          <pre>
            <h5> Launch Date:   {modalinfo.launch_date_local}</h5>{" "}
          </pre>
          <pre>
            <h5>
        
                   Orbit:                   {modalinfo.rocket.second_stage.payloads.map((x) => x.orbit)}
            </h5>
          </pre>
          <pre>
            <h5> Launch Site:         {modalinfo.launch_site.site_id}</h5>{" "}
          </pre>
        </Modal.Body>
        <Modal.Footer className="modal-footer">
          <Button variant="secondary" onClick={handleClose}>
            close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  return (
    <div className="container-fuild">
      <div className="spacexdashboardheader">
        <img src={logo} alt="logo" />
      </div>
      <div className="spacex-main-container">
        <div className="spacexoptioncontainer container-fluid">
          <div className="spacexpastsixmonthsoption">
            <select name="months" id="months">
              <option value="all">Past 6 Months</option>
            </select>
          </div>
          <div className="spacexalllaunches">
            <Spacexfiltervalues
              filterValueSelected={onfilteredValueSelected}
            ></Spacexfiltervalues>
          </div>
        </div>
        <div className="spacextablecontainer container">
          <Table
            loading={loading}
            columns={coloums}
            dataSource={dataSource}
            onRow={rowEvent}
          ></Table>
          {show ? <ModelContent /> : null}
        </div>
      </div>
    </div>
  );
};

export default Spacexdashboard;
