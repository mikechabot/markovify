import React from 'react';
import Markovify from '../services/markovify';
import _ from 'lodash';
import axios from 'axios';

/**      Author: Mike Chabot
 *  Description: Markovify
 */
class Main extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            markov: null,
            texts: []
        }
    }

    componentDidMount() {
        axios.get('http://localhost:3020/')
            .then(response => {
                this.setState({
                    markov: new Markovify(response.data, 2, 140)
                });
            })
        .catch(error => {
            console.log(error);
        });
    }

    generateText() {
        if (this.state.markov) {
            const texts = this.state.texts;
            texts.push(this.state.markov.generateRandomSentence());
            this.setState({
                texts: texts
            })
        }
    }
    render() {

        let view;
        if (!_.isEmpty(this.state.texts)) {
            view = (
                <ol>
                    {
                        this.state.texts.map((entry, index) => (
                            <li style={{margin: 20, width: '50%'}}
                                key={index}>
                                {entry}
                            </li>
                        ))
                    }
                </ol>
            )
        } else {
            view = <div>No generated text</div>;
        }

        return (
            <div>
                <button onClick={() => this.generateText()}> Generate Sentence </button>
                <div>
                    {view}
                </div>
            </div>
        );
    }
}

export default Main;