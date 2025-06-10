import { render, screen } from "@testing-library/react";
import VideoChooserPage from "../page";

// mock fetch since the component fetches videos from an API
beforeAll(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () => Promise.resolve(["video1.mp4", "video2.mov"]),
    })
  );
});

afterAll(() => {
  global.fetch.mockClear();
  delete global.fetch;
});

describe("VideoChooserPage", () => {
  it("renders a list of videos", async () => {
    render(<VideoChooserPage />);

    // wait for the videos to load
    const video1 = await screen.findByText("video1.mp4");
    const video2 = await screen.findByText("video2.mov");

    expect(video1).toBeInTheDocument();
    expect(video2).toBeInTheDocument();
  });
});