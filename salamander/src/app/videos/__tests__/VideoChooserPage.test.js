import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import VideoChooserPage from "@/app/videos/page";
import { FavoritesProvider } from "@/context/FavoritesContext";

// Clean up after each test
afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

// Mock fetch response before all tests
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(["mock-video1.mp4", "mock-video2.mov"]),
    })
  );
});

describe("VideoChooserPage", () => {
  it("renders video titles", async () => {
    render(
      <FavoritesProvider>
        <VideoChooserPage />
      </FavoritesProvider>
    );

    expect(await screen.findByText("mock-video1.mp4")).toBeInTheDocument();
    expect(await screen.findByText("mock-video2.mov")).toBeInTheDocument();
  });

  it("can toggle favorite state", async () => {
    render(
      <FavoritesProvider>
        <VideoChooserPage />
      </FavoritesProvider>
    );

    // Find all buttons with this label
    const favButtons = await screen.findAllByText("Save to Favorites");
    const firstFavButton = favButtons[0];

    fireEvent.click(firstFavButton);

    expect(await screen.findByText("Unfavorite")).toBeInTheDocument();
  });
});