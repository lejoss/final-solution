/**
 * Created by lejoss on 3/19/16.
 */

import React from 'react';
import ReactDOM from 'react-dom';
import styles from './components/dashboard/Dashboard.css'
import mainCSS from '../app/main.css'

class App extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            viewport: {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }

        }

        this.handleResize = this.handleResize.bind(this)

    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize)
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.handleResize)
    }

    handleResize() {
        this.setState({
            viewport: {
                width: document.documentElement.clientWidth,
                height: document.documentElement.clientHeight
            }
        });

    }

    render() {
        let widthScreen = this.state.viewport.width
        return (
            <div>
                <div className={mainCSS.container} style={{background:"#f5f5f5"}}>
                    <div style={{display: "flex", flex: "0 0 170px", background: "#E2E2E1"}}>

                    </div>

                    <div className={styles.wrapper}>

                        <div className={styles.left_panel} >
                            <div style={{display: widthScreen < 480 ? "none" : "flex", background:"#eee", flex:1, margin:"5px"}}></div>
                            <div style={{display:"flex", flex:1, background:"#eee", margin:"5px"}}></div>
                        </div>

                        <div className={styles.dashboard}>
                            <div className={styles.col}>
                                <div style={{border:"1px solid #222",flex:1}}></div>
                                <div style={{border:"1px solid #222", flex:1}}></div>
                            </div>

                            <div className={styles.col} style={{display: widthScreen < 768 ? "none" : "flex"}}>
                                <div style={{border:"1px solid #222", flex:1}}></div>
                                <div style={{border:"1px solid #222", flex:1}}></div>
                            </div>

                        </div>

                    </div>
                </div>

                <div className={styles.col}  style={{height:"100vh"}}>
                </div>
            </div>
        )
    }
}



//<div className={styles.col}  style={{ flex:"0 0 75%", margin:"-75px 0 auto 15px"}}>
//
//    <div className={styles.row}>
//        <div style={{flex:1, background:"#eee", margin: "5px"}}></div>
//        <div style={{flex:1, background:"#eee", margin: "5px"}}></div>
//    </div>
//
//    <div className={styles.row}>
//        <div style={{flex:1, background:"#eee", margin: "5px"}}></div>
//        <div style={{flex:1, background:"#eee", margin: "5px"}}></div>
//    </div>
//
//</div>

ReactDOM.render(<App />, document.getElementById('app'));