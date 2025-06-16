// import required testing tools and the component to test
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import VideoChooserPage from "@/app/videos/page";
import { FavoritesProvider } from "@/context/FavoritesContext";

// clean up after each test to avoid memory leaks
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// mock the fetch API to return a list of mock videos
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(["mock-video1.mp4", "mock-video2.mov"]),
    })
  );
});

// grou[ tetst related to VideoChooserPage component
describe("VideoChooserPage", () => {
    // test 1: check if video titles are rendered correctly
  it("renders video titles", async () => {
    render(
      <FavoritesProvider>
        <VideoChooserPage />
      </FavoritesProvider>
    );

    // check that both mock videos are displayed
    expect(await screen.findByText("mock-video1.mp4")).toBeInTheDocument();
    expect(await screen.findByText("mock-video2.mov")).toBeInTheDocument();
  });

  // test 2: check if clicking the favorite button works
  it("can toggle favorite state", async () => {
    render(
      <FavoritesProvider>
        <VideoChooserPage />
      </FavoritesProvider>
    );

    // Find all buttons with this label
    const favButtons = await screen.findAllByText("Save to Favorites");

    // click the first button
    const firstFavButton = favButtons[0];
    fireEvent.click(firstFavButton);

    expect(await screen.findByText("Unfavorite")).toBeInTheDocument();
  });
});