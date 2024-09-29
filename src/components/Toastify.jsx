import React, { Component } from 'react';
import { Toaster } from 'react-hot-toast';

class Toastify extends Component {
    constructor(props) {
        super(props);
    }
    state = {  }
    render() { 
        return ( 
            <>
            <Toaster
                position='top-right'
                toastOptions={{
                    className: 'rounded-md p-3 text-sm border',
                    success:{
                        style: {
                            border:'1px solid #0a8001',
                        },
                        duration: 6000,
                        theme: {
                            primary: 'green',
                            secondary: 'black'
                        }
                    },
                    error:{
                        duration: 6000,
                        style: {
                            border:'1px solid #b8040a',
                        },
                        theme: {
                            primary: 'red',
                            secondary: 'black'
                        }
                    }
                }}
                
            />
            </>
         );
    }
}
 
export default Toastify;