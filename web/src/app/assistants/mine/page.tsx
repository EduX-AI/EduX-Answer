import { ChatSidebar } from "@/app/chat/sessionSidebar/ChatSidebar";
import { InstantSSRAutoRefresh } from "@/components/SSRAutoRefresh";
import { UserDropdown } from "@/components/UserDropdown";
import { ChatProvider } from "@/components/context/ChatContext";
import { WelcomeModal } from "@/components/initialSetup/welcome/WelcomeModalWrapper";
import { ApiKeyModal } from "@/components/llm/ApiKeyModal";
import { fetchChatData } from "@/lib/chat/fetchChatData";
import { unstable_noStore as noStore } from "next/cache";
import { redirect } from "next/navigation";
import { AssistantsList } from "./AssistantsList";

export default async function GalleryPage({
  searchParams,
}: {
  searchParams: { [key: string]: string };
}) {
  noStore();

  const data = await fetchChatData(searchParams);

  if ("redirect" in data) {
    redirect(data.redirect);
  }

  const {
    user,
    chatSessions,
    availableSources,
    documentSets,
    assistants,
    tags,
    llmProviders,
    folders,
    openedFolders,
    shouldShowWelcomeModal,
  } = data;

  return (
    <>
      <InstantSSRAutoRefresh />

      {shouldShowWelcomeModal && <WelcomeModal user={user} />}

      <ChatProvider
        value={{
          user,
          chatSessions,
          availableSources,
          availableDocumentSets: documentSets,
          availablePersonas: assistants,
          availableTags: tags,
          llmProviders,
          folders,
          openedFolders,
        }}
      >
        <div className="flex relative bg-background text-default overflow-x-hidden h-screen">
          <ChatSidebar
            existingChats={chatSessions}
            currentChatSession={null}
            folders={folders}
            openedFolders={openedFolders}
          />

          <div
            className={`w-full h-screen flex flex-col overflow-y-auto overflow-x-hidden relative`}
          >
            <div className="sticky top-0 left-80 z-10 w-full bg-background flex h-fit">
              <div className="ml-auto my-auto mt-4 mr-8">
                <UserDropdown user={user} />
              </div>
            </div>

            <div className="mt-4">
              <AssistantsList user={user} assistants={assistants} />
            </div>
          </div>
        </div>
      </ChatProvider>
    </>
  );
}
