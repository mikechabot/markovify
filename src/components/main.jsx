import React from 'react';
import Markovify from '../markovify';
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
                    markov: new Markovify(response.data, 2, 500)
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
    render() {

        let view;
        if (!_.isEmpty(this.state.texts)) {
            view = (
                <ul>
                    {
                        this.state.texts.map((entry, index) => (
                            <li style={{margin: 25, width: 500}}
                                key={index}>
                                {entry}
                            </li>
                        ))
                    }
                </ul>
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