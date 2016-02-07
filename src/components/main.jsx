import React from 'react';
import Markovify from '../markovify';
import _ from 'lodash';
import axios from 'axios';
import ThemeManager from 'material-ui/lib/styles/theme-manager';
import MyRawTheme from '../common/theme';
import RaisedButton from 'material-ui/lib/raised-button';
import List from 'material-ui/lib/lists/list';
import ListItem from 'material-ui/lib/lists/list-item';
import Divider from 'material-ui/lib/divider';
import Slider from 'material-ui/lib/slider';
import Card from 'material-ui/lib/card/card';
import CardActions from 'material-ui/lib/card/card-actions';
import CardHeader from 'material-ui/lib/card/card-header';
import CardMedia from 'material-ui/lib/card/card-media';
import CardTitle from 'material-ui/lib/card/card-title';
import FlatButton from 'material-ui/lib/flat-button';
import CardText from 'material-ui/lib/card/card-text';

/**      Author: Mike Chabot
 *  Description: Markovify
 */
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isBuilt: false,
            markov: null,
            prefixLength: 2,
            charLimit: 140,
            texts: []
        }
    }

    getChildContext() {
        return {
            muiTheme: ThemeManager.getMuiTheme(MyRawTheme)
        };
    }

    componentDidMount() {
        axios.get('http://localhost:3020/')
            .then(response => {
                this.setState({
                    markov: new Markovify(response.data, 1, 500),
                    isBuilt: true
                });
            })
        .catch(error => {
            console.log(error);
        });
    }

    generateText() {
        if (this.state.markov) {
            const texts = this.state.texts;
            texts.unshift(this.state.markov.generateRandomSentence());
            this.setState({
                texts: texts
            })
        }
    }
    buildChain() {
        if (this.state.markov) {
            this.state.markov.buildMarkovChain();
            this.setState({
                texts: [],
                isBuilt: true
            })
        }
    }
    onPrefixChange() {
        const value = this.refs.prefixSlider.getValue();
        const markov = this.state.markov;
        markov.setPrefixLength(value);
        this.setState({
            prefixLength: value,
            markov: markov,
            isBuilt: false
        });
    }
    onLimitChange() {
        const value = this.refs.limitSlider.getValue();
        const markov = this.state.markov;
        markov.setCharLimit(value);
        this.setState({
            charLimit: value,
            markov: markov,
            isBuilt: false
        });
    }
    clearTexts() {
        this.setState({
            texts: []
        });
    }
    render() {
        console.log(this.state.isBuilt);
        return (
            <div className="markov-container">
                <div className="item">
                  <Card>
                    <CardHeader
                      title="Markovify"
                      subtitle="https://github.com/mikechabot"
                      avatar="http://lorempixel.com/100/100/nature/"
                    />
                    <Divider />
                    <CardActions style={{textAlign: 'center'}}>
                        {
                            this.state.isBuilt
                                ? <RaisedButton
                                    label="Generate Random Sentence"
                                    onTouchTap={() => this.generateText()}/>
                                : <RaisedButton
                                    label="Build Chain"
                                    onTouchTap={() => this.buildChain()}/>
                        }
                        {
                            this.state.texts.length !== 0
                                ? <RaisedButton
                                    label="Clear"
                                    onTouchTap={() => this.clearTexts()}/>
                                : <span />
                        }
                    </CardActions>
                    <Divider />
                    <CardText>
                       <strong>Prefix Length:</strong> {this.state.prefixLength}
                    </CardText>
                    <CardText>
                        <Slider style={{margin: 10}}
                            step={1}
                            min={1}
                            max={5}
                            defaultValue={2}
                            ref="prefixSlider"
                            onChange={() => this.onPrefixChange()}/>
                    </CardText>
                    <CardText>
                       <strong>Character Limit:</strong> {this.state.charLimit}
                    </CardText>
                    <CardText>
                        <Slider style={{margin: 10}}
                            step={20}
                            min={5}
                            max={1000}
                            defaultValue={140}
                            ref="limitSlider"
                            onChange={() => this.onLimitChange()}/>
                    </CardText>
                    <Divider />
                    <CardText>
                       <strong>Generated Sentences</strong>
                    </CardText>
                    <CardText>
                        <List stlye={{fontFamily: 'Consolas'}}>
                            {
                                this.state.texts.length === 0
                                    ? <ListItem primaryText="Nothing to show" />
                                    :  this.state.texts.map((entry, index) => (
                                           <span key={index}>
                                              <Divider />
                                              <ListItem primaryText={entry} style={{lineHeight: '1.5em'}}/>
                                           </span>
                                        ))

                            }
                        </List>
                    </CardText>
                  </Card>
                </div>
            </div>
        );
    }
}

Main.childContextTypes = {
    muiTheme: React.PropTypes.object
};

export default Main;