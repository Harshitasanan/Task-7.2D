import React, { useEffect, useState } from 'react';
import { db } from '../firebase';
import { Button, Card, Grid, Container, Image } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
import { collection, deleteDoc, onSnapshot, doc } from 'firebase/firestore';
import ModalComp from '../components/ModalComp';

const Home = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const unsub = onSnapshot(collection(db, 'users'), (snapshot) => {
      let list = [];
      snapshot.docs.forEach((doc) => {
        list.push({ id: doc.id, ...doc.data() });
      });
      setUsers(list);
      setLoading(false);
    }, (error) => {
      console.log(error);
    });

    return () => {
      unsub();
    };
  }, []);

  const handleModal = (item) => {
    setOpen(true);
    setUser(item);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete?')) {
      try {
        setOpen(false);
        await deleteDoc(doc(db, 'users', id));
        setUsers(users.filter((user) => user.id !== id));
      } catch (err) {
        console.log(err);
      }
    }
  };

  const [hoveredCard, setHoveredCard] = useState(null);

  const cardStyle = {
    border: '3px solid black',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
    
  };

  return (
    <Container>
      <Grid columns={3} stackable>
        {users &&
          users.map((item) => (
            <Grid.Column key={item.id}>
              <Card
                style={cardStyle}
                onMouseEnter={() => setHoveredCard(item.id)}
                onMouseLeave={() => setHoveredCard(null)}
              >
                <Card.Content>
                  <Image
                    src={item.img}
                    size="medium"
                    style={{ height: '150px', width: '150px', borderRadius: '50%' }}
                  />
                  <Card.Header style={{ marginTop: '10px' }}>{item.title}</Card.Header>
                  <Card.Description>{item.tags}</Card.Description>
                </Card.Content>
                <Card.Content extra>
                  <div>
                    <Button color="black" onClick={() => navigate(`/update/${item.id}`, { user: item })}>
                      Update
                    </Button>
                    <Button color="purple" onClick={() => handleModal(item)}>
                      View
                    </Button>
                    {open && (
                      <ModalComp open={open} setOpen={setOpen} handleDelete={handleDelete} {...user} />
                    )}
                  </div>
                </Card.Content>
              </Card>
            </Grid.Column>
          ))}
      </Grid>
    </Container>
  );
};

export default Home;
