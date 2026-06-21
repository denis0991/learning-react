import { describe, expect, test, vi, beforeEach, afterEach } from 'vitest';

describe('main.tsx', () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  afterEach(() => {
    const root = document.getElementById('root');
    if (root && root.parentNode) {
      root.parentNode.removeChild(root);
    }
  });

  test('renders App when root element exists', async () => {
    const root = document.createElement('div');
    root.id = 'root';
    document.body.appendChild(root);

    const mockRender = vi.fn();

    vi.doMock('react-dom/client', () => ({
      createRoot: () => ({
        render: mockRender,
      }),
    }));

    await import('./main');

    expect(mockRender).toHaveBeenCalled();

    document.body.removeChild(root);
  });

  test('does nothing when root element does not exist', async () => {
    let renderCalled = false;

    vi.doMock('react-dom/client', () => ({
      createRoot: () => ({
        render: () => {
          renderCalled = true;
        },
      }),
    }));

    await import('./main');

    expect(renderCalled).toBe(false);
  });
});
