import React from 'react'
import {Modal, Header, Button, Image} from 'semantic-ui-react'

const ModalComp = ({open, setOpen, img, tags, abstract, title, articleText , id, handleDelete}) => {
  return (
    <Modal onClose={() => setOpen(false)} onOpen={()=> setOpen(true)} open={open}>
        <Modal.Header>User Details</Modal.Header>
        <Modal.Content image>
            <Image size="medium" src={img} wrapped/>
            <Modal.Description>
                <Header>{title}</Header>
                <p>{abstract}</p>
                <p>{articleText}</p>
                <p>{tags}</p>
            </Modal.Description>
        </Modal.Content>
        <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false) }>
                      Cancel
                    </Button>
                    <Button color="red" content="Delete" labelPosition='right' icon ="checkmark" onClick={()=>handleDelete(id)}/>
                      
        </Modal.Actions>
    </Modal>
  )
}

export default ModalComp
