# Running

To open the program, run `yarn start` or `npm start` in the root directory.

# What is this exactly?

This project is an experiment to help me with writing. I have plans to include rwkv, but its not even needed yet.

# The main components.

## The character editor

You can add and edit characters.

## HistoryItems

Characters, instead of having an inventory, have a list of HistoryItems. These are events that happen to the character, and a list of items they gain or lose.

## Inventory

The inventory is a list of items that the character has, and is calculated from the HistoryItems.

# The Loot Table

The loot table is a list of all possible items, physical, ephemoral, and abstract.
You can use Loot to generate more loot, effects, and events.

## Loot

Loot items have <b>Effects</b>.

## Passive

Items can have Passive subitems. if a character "owns" the item, they are treated as if they also own the passive subitems.

For example.

Character A owns the item <b> Sword of the Gods </b>. This item has 2 passive subitems of type <b> Strength </b>.

In the character inventory, the character will have 2 Strength items in addition to the sword.

You can also have negative amounts of subitems. For example, if you have a sword that has a negative effect of -1 Strength, you will have 1 less Strength item in your inventory.

## Active

Items can have Active subitems. If a character "owns" the item, when the item is used in the character's inventory, a HistoryItem is created with the activeString property as its event description, and the character gains the items in the ActiveSubitems property.

If you wanted a single use object, you can add -1 of itself to the ActiveSubitems property. This will remove the item from the character's inventory after it is used.

## Images

Clicking on an empty image will generate a picture using stable horde. It may take a minute or two to generate a picture.
