import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// ✅ Define the PostData interface (you can move this to a types file if needed)
export interface PostData {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: {
    likes: number;
    dislikes: number;
  };
  views: number;
  userId: number;
}

// ✅ Define the PostsState interface
interface PostsState {
  items: PostData[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// ✅ Initial state
const initialState: PostsState = {
  items: [],
  status: 'idle',
  error: null,
};

// ✅ Async thunk to fetch all posts
export const fetchPosts = createAsyncThunk<PostData[]>(
  'posts/fetchPosts',
  async () => {
    const res = await fetch('https://dummyjson.com/posts');
    const data = await res.json();
    return data.posts as PostData[];
  }
);

// ✅ Async thunk to fetch posts by search term
export const fetchPostsBySearch = createAsyncThunk<PostData[], string>(
  'posts/fetchPostsBySearch',
  async (searchTerm: string) => {
    const res = await fetch(`https://dummyjson.com/posts/search?q=${searchTerm}`);
    const data = await res.json();
    return data.posts as PostData[];
  }
);

// ✅ Create slice
const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchPosts
      .addCase(fetchPosts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<PostData[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      })

      // fetchPostsBySearch
      .addCase(fetchPostsBySearch.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchPostsBySearch.fulfilled, (state, action: PayloadAction<PostData[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchPostsBySearch.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? null;
      });
  },
});

export default postsSlice.reducer;
