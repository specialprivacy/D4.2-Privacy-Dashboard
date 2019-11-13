import React, {Component} from 'react';
import DataTimeline from "./DataTimeline";
import data from '../data/data.json';
import {Card, CardText} from "material-ui";
import ControllerInfo from "../sidebar/ControllerInfo";
import FilterControls from "../controls/FilterControls";

const chunkSize = 60;

class DataTimelineContainer extends Component {

    state = {
        data: data,
        limit: chunkSize,
    };

    loadMore = () => {
        this.setState({limit: this.state.limit + chunkSize});
    };

    componentWillReceiveProps(nextProps) {
        this.setState({limit: chunkSize});
    }

    componentWillUpdate(nextProps, nextState) {
        nextState.data = data
            .filter(function (e) {
                return (((e.context === 1 || e.context === 2) && nextProps.controls.intentionalChecked) ||
                    (e.context === 3 && nextProps.controls.incidentalChecked) ||
                    (e.context === 4 && nextProps.controls.behavioralChecked) ||
                    (e.context === 5 && nextProps.controls.derivedChecked)) &&

                    ((e.type === "text" && nextProps.controls.textChecked) ||
                        (e.type === "image" && nextProps.controls.imageChecked) ||
                        (e.type === "audio" && nextProps.controls.audioChecked) ||
                        (e.type === "video" && nextProps.controls.videoChecked) ||
                        (e.type === "location" && nextProps.controls.locationChecked)) &&

                    (e.date >= nextProps.controls.from && e.date <= nextProps.controls.to)
            });
    }

    render() {
        return (
            <div className="row" style={{marginTop: "20px"}}>
                <div className="col-md-4 col-lg-3 hidden-xs hidden-sm">
                    <Card>
                        <CardText>
                            <FilterControls
                                controls={this.props.controls}
                                toggleChecked={this.props.toggleChecked}
                                setTimerange={this.props.setTimerange}
                            />
                        </CardText>
                    </Card>
                </div>
                <div className="col-md-3 col-md-push-5 col-lg-3 col-lg-push-6">
                    <Card>
                        <CardText>
                            <ControllerInfo/>
                        </CardText>
                    </Card>
                </div>
                <div className="col-md-5 col-md-pull-3 col-lg-6 col-lg-pull-3">
                    <DataTimeline
                        data={this.state.data.sort(function (a, b) { return a.date - b.date; }).slice(0, this.state.limit)}
                        loadMore={this.loadMore}
                    />
                </div>
            </div>
        );
    }
}

export default DataTimelineContainer;