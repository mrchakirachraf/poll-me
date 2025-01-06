import React from 'react';
import Button from "../components/Button";
import { Link } from 'react-router-dom';


const PollMe = () => {

    return (
        <div>
            PollMe
            <br />
            <Link className='inline' to="/signin">
                <Button style={{}} class="btn_DeepTale w-32 lg:w-52" text='Sign In'></Button>
            </Link>
        </div>
    );
};

export default PollMe;