import React, { useState, useEffect } from 'react';
// import './PostPage.css';
import './Header.css'
import { storage, db } from "./firebase";
import { uploadBytesResumable, ref, getDownloadURL } from 'firebase/storage';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const PostPage = () => {
  const [postType, setPostType] = useState('question');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [abstract, setAbstract] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [image, setImage] = useState(null);
  const [imgURL, setImgURL] = useState(''); // Store the uploaded image URL

  const handlePostTypeChange = (event) => {
    setPostType(event.target.value);
  };

  const handleImageChange = (event) => {
    const selectedImage = event.target.files[0];
    setImage(selectedImage);
  };

  const handleImageUpload = () => {
    if (image) {
      const name = new Date().getTime() + image.name;
      const storageRef = ref(storage, name);
      const uploadTask = uploadBytesResumable(storageRef, image);
  
      uploadTask.on(
        'state_changed',
        (snapshot) => {
          // Handle upload progress if needed
        },
        (error) => {
          console.error('Error uploading image:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              imgURL(downloadURL); // Store the uploaded image URL
              handleSubmit(); // Call the submit function after the URL is set
            })
            .catch((error) => {
              console.error('Error getting image URL:', error);
            });
        }
      );
    } else {
      console.log('No image selected for upload.');
    }
  };
  const handleSubmit = async () => {
    // Check for required fields and display an error message if any field is empty
    if (!title || !content || (postType === 'question' && !tags) || (postType === 'article' && !abstract)) {
      setErrorMessage('Please fill in all the required fields.');
      return;
    }
  
    try {
      const postDocRef = await addDoc(collection(db, 'posts'), {
        postType,
        title,
        content,
        tags,
        abstract,
        imgURL,
        timestamp: serverTimestamp(),
      });
  
      console.log('Post added with ID: ', postDocRef.id);
      alert('Thank you for your response');
      setErrorMessage('');
    } catch (error) {
      console.error('Error adding post: ', error);
    }
  };
  

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event) => {
    setContent(event.target.value);
  };

  const handleTagsChange = (event) => {
    setTags(event.target.value);
  };

  const handleAbstractChange = (event) => {
    setAbstract(event.target.value);
  };

  const getDescriptionText = () => {
    return postType === 'question'
      ? 'For posting a question, the following section will appear.'
      : 'For posting an article, the following section will appear.';
  };

  return (
    <div>
      <h1 className='style'>New Post</h1>
      <div className='Select'>
        <label><b>Select Post Type:</b></label>
        <div className='space'>
          <label>
            <input
              type="radio"
              value="question"
              checked={postType === 'question'}
              onChange={handlePostTypeChange}
            />
            Question
          </label>
          <label className='space1'>
            <input
              type="radio"
              value="article"
              checked={postType === 'article'}
              onChange={handlePostTypeChange}
            />
            Article
          </label>
        </div>
      </div>
      <h1 className='style'>What do you want to ask or share</h1>
      <p><b>This section is designed based on the type of the post. It could be developed by conditional rendering. <span style={{ color: 'red' }}>{getDescriptionText()}</span></b></p>
      <div className='between'>
        <label><b>Title:</b></label>
        <input
          className='title'
          type="text"
          value={title}
          placeholder={
            postType === 'question'
              ? 'Start your question with how, what, why, etc.'
              : 'Enter a descriptive title'
          }
          onChange={handleTitleChange}
        />
        {postType === 'article' && (
          <>
            <label><b>Image:</b></label>
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
            </div>
            <div>
              <button className='button' onClick={handleImageUpload}>Upload Image</button>
              <button className='button'>Browse Images</button>
            </div>
          </>
        )}
      </div>
      {postType === 'question' && (
        <div>
          <div className='between'>
            <label className='bottom'><b>Describe Your Problem:</b></label>
            <label className='bottom'>
              <textarea className='content' value={content} onChange={handleContentChange} />
            </label>
          </div>
          <div className='between'>
            <label><b>Tags:</b></label>
            <input className='bottom1'
              type="text"
              value={tags}
              placeholder="Please add up to 3 tags to describe what your question is about e.g., Java"
              onChange={handleTagsChange}
            />
          </div>
        </div>
      )}
      {postType === 'article' && (
        <div className='between'>
          <label><b>Abstract:</b></label>
          <label>
            <textarea className='content'
              value={abstract}
              placeholder="Enter a 1-paragraph abstract"
              onChange={handleAbstractChange}
            />
          </label>
          <div className='between'>
            <label><b>Article Text:</b></label>
            <textarea className='bottom1'
              value={content}
              placeholder="Enter the article text"
              onChange={handleContentChange}
            />
          </div>
        </div>
      )}
      {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
      <div className='button-container'>
        <button className='button' onClick={handleSubmit}>Post</button>
      </div>
    </div>
  );
};

export default PostPage;