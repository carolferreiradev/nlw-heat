defmodule HeatTagsWeb.MessagesView do
  use HeatTagsWeb, :view

  def render("create.json", %{message: message}) do
    %{
      result: "Mensagem criada com sucesso!",
      message: message
    }
  end
end
