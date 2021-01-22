# Alex-Tom-Blog
Project One

https://alex-tom-app.herokuapp.com/

## Project Decription
This project was part of our assignment for General Assembly, where we were asked to make a full stack website using full CRUD, and implementing three different data types. For our project, we decided to create an art blog, as Alex had already conceptualized the idea as a side project and was working on it individually already, so we had some direction and idea of where we wanted to take the project. 

The blog is deisgned to be a private blog (so non-admin viewers can't create accounts) where artists can work collaboratively in creating art and writing about their process. Within the app, viewers can read through the users blog posts, browse a gallery of images they created, and reach out to the users via their contact information. User accounts are able to create blog posts, post them to either their personal pages or the collaborative blog, as well as edit and delete their posts. We also implemented externally hosted image uploading, so that users can freely upload images containing their artwork directly to the cloud using our website. User access is restricted behind encrypted login information, and logging into an account will give users access to creating blog posts, as well as editing them or deleting them, as well as editing their personal information displayed on their profile pages, or even deleting their account entirely. 


## Technology Used
For our project, we implemented a host of addons, and our website is deployed using Heroku's web-hosting services. 

### Languages
- HTML (rendered using Embedded JavaScript templates)
- CSS
- Javascript

### Deployment
- Git
- GitHub
- Heroku
- Mongo Atlas
- Amazon Web Services (S3)
- Node.js

### Node Packages
- NPM 
- Amazon Web Services Web Development Kit (AWS SDK)
- bcrypt
- dotenv
- Embedded JavaScript (EJS)
- Express
- Express Session
- Method Override
- Mongoose
- Multer
- Nodemon


## Existing Features
Our project allows viewers to do the following:

Viewers:
  - View Home page which displays:
    - Navigation links to users' personal blogs, the collaborative blog, a gallery only display, and contact info
    - Gallery containing images with imbedded links to the users' posts where they orginated from
    - A Collab Blog preview displaying the most recent post to the collaborative blog
    - A login link allowing user to log into their accounts if they aren't logged in, or links to the user's page if they are
    - A link to logout if they are logged in
  - View User profile pages which display:
    - A blog display showing previews of each blog post the user made, either collaboratively or personally
    - Links to the blog post display pages, which will show the full blog post as well as all images associated with it
   - View Collab Blog
    - Shows previews of posts from all users designated to be crossposted to the collab blog
    - Links imbedded in the titles to take the to blog post display page
   - View Contact Info page
    - Displays the users and their emails for contact info about acquiring art
  
Users:
  - Profile Page
    - Links containing forms to edit profile, edit posts, delete posts, and create new blog posts
  - Edit Profile
    - Edit Username, Email, Password, and Display Name
    - Delete account and all posts and images made by that account
  - Edit Post
    - Change the Title and Body of a post, and can also make the post collaborative or private
  - New Blog
    - Create blog post with a title, body, and collaborative toggle associate with post
    - Upload images from their local files to an Amazon Web Services cloud where they can be stored indefinitely and free of charge
    - Submit button to redirect them back to their profile page
  - Logout Button
    - Allows user to log out if they choose to do so
 
 
## Planned Features
 
In the future, users of our site will be able to 
- Make blog posts using rich text so they can decorate their blog posts more personally
- Customize their profile pages with profile pictures, color schemes, etc
- Upload more media formats like GIFs and Videos
- eCommerce functionality so users can sell their art to viewers
- Go to a website with a better name than Alex and Tom's Blog



