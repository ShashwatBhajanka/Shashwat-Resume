import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

const rootElement = document.getElementById("root");
if (!rootElement) throw new Error("#root not found");

try {
  const { RouterProvider } = await import("@tanstack/react-router");
  const { QueryClientProvider } = await import("@tanstack/react-query");
  const { getRouter } = await import("./router");

  const router = getRouter();
  const queryClient = router.options.context.queryClient;

  createRoot(rootElement).render(
    <StrictMode>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </StrictMode>,
  );
} catch (e) {
  rootElement.innerHTML = `<pre style="color:red;padding:20px;font-family:monospace;font-size:14px;">Error: ${(e instanceof Error ? e.stack || e.message : String(e)).replace(/</g, '&lt;')}</pre>`;
}
