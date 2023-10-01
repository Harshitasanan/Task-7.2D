import React, { useState, useEffect } from 'react';
import { Button, Form, Grid, Loader, Radio } from 'semantic-ui-react'; // Import Radio component
import { storage, db } from '../firebase';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { addDoc, collection, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';

const initialState = {
  title: '',
  abstract: '',
  articleText: '',
  tags: '',
  img: '',
};

const AddEditUser = () => {
  const [data, setData] = useState(initialState);
  const { title, abstract, articleText, tags, img } = data;
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(null);
  const [errors, setError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [selectedType, setSelectedType] = useState('Question'); // Track selected type (default: Question)
  const [showImgInput, setShowImgInput] = useState(true); // Control visibility of img input
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();

  useEffect(() => {
    if (location.state && location.state.user) {
      // If user object is passed via location state, populate the form
      setData(location.state.user);
    } else {
      // Otherwise, it's a new user
      setData(initialState);
    }
  }, [location.state]);

  useEffect(() => {
    id && getSingleUser();
  }, [id]);

  const getSingleUser = async () => {
    const docRef = doc(db, 'users', id);
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      setData({ ...snapshot.data() });
    }
  };

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleTypeChange = (e, { value }) => {
    setSelectedType(value); // Update the selected type
    if (value === 'Question') {
      setShowImgInput(false); // Hide img input for questions
    } else {
      setShowImgInput(true); // Show img input for articles
    }
  };

  const validate = () => {
    let errors = {};
    if (!title || !abstract || !articleText || !tags) {
      errors.errorMessage = 'Please fill in all the required fields.';
    }
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let errors = validate();
    if (Object.keys(errors).length) return setError(errors);
    setIsSubmit(true);

    try {
      if (id) {
        // Update existing user
        const userRef = doc(db, 'users', id);
        await updateDoc(userRef, {
          title,
          abstract,
          articleText,
          tags,
          img: selectedType === 'Article' ? img : '', // Include img for articles only
        });
        console.log('User updated successfully');
      } else {
        // Add new user
        const docRef = await addDoc(collection(db, 'users'), {
          title,
          abstract,
          articleText,
          tags,
          img: selectedType === 'Article' ? img : '', // Include img for articles only
          timestamp: serverTimestamp(),
        });
        console.log('User added with ID: ', docRef.id);
      }
      alert('Thank you for your response');
      setData({ ...initialState });
      navigate('/');
    } catch (error) {
      console.error('Error:', error);
    }
    setIsSubmit(false);
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  };

  useEffect(() => {
    const uploadFile = () => {
      if (!file) return;
      const uniqueID = Math.random().toString(36).substring(2);
      const name = uniqueID + '_' + file.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const uploadProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setProgress(uploadProgress);
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              setData((prev) => ({ ...prev, img: downloadURL }));
            })
            .catch((error) => {
              console.error('Error getting image URL:', error);
            });
        }
      );
    };
    uploadFile();
  }, [file]);

  return (
    <div>
      <Grid centered verticalAlign="middle" columns="3" style={{ height: '80vh' }}>
        <Grid.Row>
          <Grid.Column textAlign="center">
            <div>
              {isSubmit ? (
                <Loader active inline="centered" size="huge" />
              ) : (
                <>
                  <h2>{id ? 'Update User' : 'New User'}</h2>
                  <Form onSubmit={handleSubmit}>
                    <Form.Field>
                      <label>Select Type</label>
                      <Form.Group inline>
                        <Form.Field
                          control={Radio}
                          label="Question"
                          value="Question"
                          checked={selectedType === 'Question'}
                          onChange={handleTypeChange}
                        />
                        <Form.Field
                          control={Radio}
                          label="Article"
                          value="Article"
                          checked={selectedType === 'Article'}
                          onChange={handleTypeChange}
                        />
                      </Form.Group>
                    </Form.Field>
                    <Form.Input
                      label="Title"
                      error={errors.title ? { content: errors.title } : null}
                      placeholder="Enter Title"
                      name="title"
                      onChange={handleChange}
                      value={title}
                      autoFocus
                    />
                    <Form.TextArea
                      label="Abstract"
                      error={errors.abstract ? { content: errors.abstract } : null}
                      placeholder="Enter Abstract"
                      name="abstract"
                      onChange={handleChange}
                      value={abstract}
                    />
                    <Form.TextArea
                      label="Article Text"
                      error={errors.articleText ? { content: errors.articleText } : null}
                      placeholder="Enter Article Text"
                      name="articleText"
                      onChange={handleChange}
                      value={articleText}
                    />
                    <Form.Input
                      label="Tags"
                      error={errors.tags ? { content: errors.tags } : null}
                      placeholder="Enter Tags"
                      name="tags"
                      onChange={handleChange}
                      value={tags}
                    />
                    {showImgInput && (
                      <Form.Input label="Upload" type="file" onChange={handleFileUpload} />
                    )}
                    <Button primary type="submit" disabled={progress !== null && progress < 100}>
                      {id ? 'Update' : 'Submit'}
                    </Button>
                  </Form>
                </>
              )}
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
    </div>
  );
};

export default AddEditUser;
