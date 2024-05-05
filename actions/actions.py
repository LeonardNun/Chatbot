# actions/actions.py

from rasa_sdk import Action
from rasa_sdk.events import SlotSet
from rasa_sdk.executor import CollectingDispatcher

class ActionVerifyOrder(Action):
    def name(self):
        return "action_verify_order"

    def run(self, dispatcher, tracker, domain):
        order_id = tracker.get_slot('order_id')
        if order_id and order_id.isdigit():
            dispatcher.utter_message(text=f"O número do pedido {order_id} é válido.")
        else:
            dispatcher.utter_message(text="O número do pedido fornecido não é válido.")
        return []

class ActionCollectFeedback(Action):
    def name(self):
        return "action_collect_feedback"

    def run(self, dispatcher, tracker, domain):
        feedback = tracker.latest_message.get('text')
        dispatcher.utter_message(text="Obrigado pelo seu feedback!")
        return []
