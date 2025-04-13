import Signup from "../Routes/Signup";
import Login from "../Routes/Login";
import Profile from "../Routes/Profile";
import ResetPassword from "../Routes/ResetPassword";
import NotesList from "../pages/NotesList";
import CreateNote from "../pages/CreateNote";
import ViewNote from "../pages/ViewNote";
import EditNote from "../pages/EditNote";
import SharedNote from "../pages/SharedNote";
import TaskPage from "../pages/TodoPage";
import NewsPage from "../pages/NewsPage";
import SearchPage from "../Routes/SearchPage";
import Chatbot from '../components/Chatbot';
import Landing from '../pages/Landing';
import NewsDetail from '../pages/NewsDetail';
import ResumeAI from '../pages/Resume';
import PrivateRoute from "../components/PrivateRoute";

export const publicRoutes = [
  { path: "/", element: <Landing /> },
  { path: "/signup", element: <Signup /> },
  { path: "/auth/login", element: <Login /> },
  { path: "/reset-password/:token", element: <ResetPassword /> },
  { path: "/news", element: <NewsPage /> },
  { path: "/news/:id", element: <NewsDetail /> },
  { path: "/search", element: <SearchPage /> },
  { path: "/chat", element: <Chatbot /> },
  { path: "/resume", element: <ResumeAI /> },
];

export const privateRoutes = [
  { path: "/notes", element: <NotesList /> },
  { path: "/notes/new", element: <CreateNote /> },
  { path: "/notes/:noteId", element: <ViewNote /> },
  { path: "/notes/:noteId/edit", element: <EditNote /> },
  { path: "/notes/shared/:noteId/:token", element: <SharedNote /> },
  { path: "/profile", element: <Profile /> },
  { path: "/todo", element: <TaskPage /> },
];
