import { Alert } from 'react-bootstrap'

const Message = ({variant, children }) => {
    return (
        <Alert variant={variant} style={{ padding: '15px 30px' }} >
            {children}
        </Alert>
    );
}
 
export default Message;