// SPDX-License-Identifier: MIT
pragma solidity >=0.8.21;

/* Autogenerated file. Do not edit manually. */

// Import schema type
import { SchemaType } from "@latticexyz/schema-type/src/solidity/SchemaType.sol";

// Import store internals
import { IStore } from "@latticexyz/store/src/IStore.sol";
import { StoreSwitch } from "@latticexyz/store/src/StoreSwitch.sol";
import { StoreCore } from "@latticexyz/store/src/StoreCore.sol";
import { Bytes } from "@latticexyz/store/src/Bytes.sol";
import { Memory } from "@latticexyz/store/src/Memory.sol";
import { SliceLib } from "@latticexyz/store/src/Slice.sol";
import { EncodeArray } from "@latticexyz/store/src/tightcoder/EncodeArray.sol";
import { FieldLayout, FieldLayoutLib } from "@latticexyz/store/src/FieldLayout.sol";
import { Schema, SchemaLib } from "@latticexyz/store/src/Schema.sol";
import { PackedCounter, PackedCounterLib } from "@latticexyz/store/src/PackedCounter.sol";
import { ResourceId } from "@latticexyz/store/src/ResourceId.sol";
import { RESOURCE_TABLE, RESOURCE_OFFCHAIN_TABLE } from "@latticexyz/store/src/storeResourceTypes.sol";

ResourceId constant _tableId = ResourceId.wrap(bytes32(abi.encodePacked(RESOURCE_TABLE, bytes14(""), bytes16("Game"))));
ResourceId constant GameTableId = _tableId;

FieldLayout constant _fieldLayout = FieldLayout.wrap(
  0x0000000200000000000000000000000000000000000000000000000000000000
);

struct GameData {
  string name;
  bytes32[] entity;
}

library Game {
  /**
   * @notice Get the table values' field layout.
   * @return _fieldLayout The field layout for the table.
   */
  function getFieldLayout() internal pure returns (FieldLayout) {
    return _fieldLayout;
  }

  /**
   * @notice Get the table's key schema.
   * @return _keySchema The key schema for the table.
   */
  function getKeySchema() internal pure returns (Schema) {
    SchemaType[] memory _keySchema = new SchemaType[](1);
    _keySchema[0] = SchemaType.BYTES32;

    return SchemaLib.encode(_keySchema);
  }

  /**
   * @notice Get the table's value schema.
   * @return _valueSchema The value schema for the table.
   */
  function getValueSchema() internal pure returns (Schema) {
    SchemaType[] memory _valueSchema = new SchemaType[](2);
    _valueSchema[0] = SchemaType.STRING;
    _valueSchema[1] = SchemaType.BYTES32_ARRAY;

    return SchemaLib.encode(_valueSchema);
  }

  /**
   * @notice Get the table's key field names.
   * @return keyNames An array of strings with the names of key fields.
   */
  function getKeyNames() internal pure returns (string[] memory keyNames) {
    keyNames = new string[](1);
    keyNames[0] = "key";
  }

  /**
   * @notice Get the table's value field names.
   * @return fieldNames An array of strings with the names of value fields.
   */
  function getFieldNames() internal pure returns (string[] memory fieldNames) {
    fieldNames = new string[](2);
    fieldNames[0] = "name";
    fieldNames[1] = "entity";
  }

  /**
   * @notice Register the table with its config.
   */
  function register() internal {
    StoreSwitch.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config.
   */
  function _register() internal {
    StoreCore.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Register the table with its config (using the specified store).
   */
  function register(IStore _store) internal {
    _store.registerTable(_tableId, _fieldLayout, getKeySchema(), getValueSchema(), getKeyNames(), getFieldNames());
  }

  /**
   * @notice Get name.
   */
  function getName(bytes32 key) internal view returns (string memory name) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Get name.
   */
  function _getName(bytes32 key) internal view returns (string memory name) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreCore.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Get name (using the specified store).
   */
  function getName(IStore _store, bytes32 key) internal view returns (string memory name) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getDynamicField(_tableId, _keyTuple, 0);
    return (string(_blob));
  }

  /**
   * @notice Set name.
   */
  function setName(bytes32 key, string memory name) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setDynamicField(_tableId, _keyTuple, 0, bytes((name)));
  }

  /**
   * @notice Set name.
   */
  function _setName(bytes32 key, string memory name) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setDynamicField(_tableId, _keyTuple, 0, bytes((name)));
  }

  /**
   * @notice Set name (using the specified store).
   */
  function setName(IStore _store, bytes32 key, string memory name) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setDynamicField(_tableId, _keyTuple, 0, bytes((name)));
  }

  /**
   * @notice Get the length of name.
   */
  function lengthName(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = StoreSwitch.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get the length of name.
   */
  function _lengthName(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = StoreCore.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get the length of name (using the specified store).
   */
  function lengthName(IStore _store, bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = _store.getDynamicFieldLength(_tableId, _keyTuple, 0);
    unchecked {
      return _byteLength / 1;
    }
  }

  /**
   * @notice Get an item of name.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemName(bytes32 key, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = StoreSwitch.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Get an item of name.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function _getItemName(bytes32 key, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = StoreCore.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Get an item of name (using the specified store).
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemName(IStore _store, bytes32 key, uint256 _index) internal view returns (string memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = _store.getDynamicFieldSlice(_tableId, _keyTuple, 0, _index * 1, (_index + 1) * 1);
      return (string(_blob));
    }
  }

  /**
   * @notice Push a slice to name.
   */
  function pushName(bytes32 key, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Push a slice to name.
   */
  function _pushName(bytes32 key, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Push a slice to name (using the specified store).
   */
  function pushName(IStore _store, bytes32 key, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.pushToDynamicField(_tableId, _keyTuple, 0, bytes((_slice)));
  }

  /**
   * @notice Pop a slice from name.
   */
  function popName(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Pop a slice from name.
   */
  function _popName(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Pop a slice from name (using the specified store).
   */
  function popName(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.popFromDynamicField(_tableId, _keyTuple, 0, 1);
  }

  /**
   * @notice Update a slice of name at `_index`.
   */
  function updateName(bytes32 key, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreSwitch.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update a slice of name at `_index`.
   */
  function _updateName(bytes32 key, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = bytes((_slice));
      StoreCore.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update a slice of name (using the specified store) at `_index`.
   */
  function updateName(IStore _store, bytes32 key, uint256 _index, string memory _slice) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = bytes((_slice));
      _store.spliceDynamicData(_tableId, _keyTuple, 0, uint40(_index * 1), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Get entity.
   */
  function getEntity(bytes32 key) internal view returns (bytes32[] memory entity) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreSwitch.getDynamicField(_tableId, _keyTuple, 1);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_bytes32());
  }

  /**
   * @notice Get entity.
   */
  function _getEntity(bytes32 key) internal view returns (bytes32[] memory entity) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = StoreCore.getDynamicField(_tableId, _keyTuple, 1);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_bytes32());
  }

  /**
   * @notice Get entity (using the specified store).
   */
  function getEntity(IStore _store, bytes32 key) internal view returns (bytes32[] memory entity) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    bytes memory _blob = _store.getDynamicField(_tableId, _keyTuple, 1);
    return (SliceLib.getSubslice(_blob, 0, _blob.length).decodeArray_bytes32());
  }

  /**
   * @notice Set entity.
   */
  function setEntity(bytes32 key, bytes32[] memory entity) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setDynamicField(_tableId, _keyTuple, 1, EncodeArray.encode((entity)));
  }

  /**
   * @notice Set entity.
   */
  function _setEntity(bytes32 key, bytes32[] memory entity) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setDynamicField(_tableId, _keyTuple, 1, EncodeArray.encode((entity)));
  }

  /**
   * @notice Set entity (using the specified store).
   */
  function setEntity(IStore _store, bytes32 key, bytes32[] memory entity) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setDynamicField(_tableId, _keyTuple, 1, EncodeArray.encode((entity)));
  }

  /**
   * @notice Get the length of entity.
   */
  function lengthEntity(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = StoreSwitch.getDynamicFieldLength(_tableId, _keyTuple, 1);
    unchecked {
      return _byteLength / 32;
    }
  }

  /**
   * @notice Get the length of entity.
   */
  function _lengthEntity(bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = StoreCore.getDynamicFieldLength(_tableId, _keyTuple, 1);
    unchecked {
      return _byteLength / 32;
    }
  }

  /**
   * @notice Get the length of entity (using the specified store).
   */
  function lengthEntity(IStore _store, bytes32 key) internal view returns (uint256) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    uint256 _byteLength = _store.getDynamicFieldLength(_tableId, _keyTuple, 1);
    unchecked {
      return _byteLength / 32;
    }
  }

  /**
   * @notice Get an item of entity.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemEntity(bytes32 key, uint256 _index) internal view returns (bytes32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = StoreSwitch.getDynamicFieldSlice(_tableId, _keyTuple, 1, _index * 32, (_index + 1) * 32);
      return (bytes32(_blob));
    }
  }

  /**
   * @notice Get an item of entity.
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function _getItemEntity(bytes32 key, uint256 _index) internal view returns (bytes32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = StoreCore.getDynamicFieldSlice(_tableId, _keyTuple, 1, _index * 32, (_index + 1) * 32);
      return (bytes32(_blob));
    }
  }

  /**
   * @notice Get an item of entity (using the specified store).
   * @dev Reverts with Store_IndexOutOfBounds if `_index` is out of bounds for the array.
   */
  function getItemEntity(IStore _store, bytes32 key, uint256 _index) internal view returns (bytes32) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _blob = _store.getDynamicFieldSlice(_tableId, _keyTuple, 1, _index * 32, (_index + 1) * 32);
      return (bytes32(_blob));
    }
  }

  /**
   * @notice Push an element to entity.
   */
  function pushEntity(bytes32 key, bytes32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.pushToDynamicField(_tableId, _keyTuple, 1, abi.encodePacked((_element)));
  }

  /**
   * @notice Push an element to entity.
   */
  function _pushEntity(bytes32 key, bytes32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.pushToDynamicField(_tableId, _keyTuple, 1, abi.encodePacked((_element)));
  }

  /**
   * @notice Push an element to entity (using the specified store).
   */
  function pushEntity(IStore _store, bytes32 key, bytes32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.pushToDynamicField(_tableId, _keyTuple, 1, abi.encodePacked((_element)));
  }

  /**
   * @notice Pop an element from entity.
   */
  function popEntity(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.popFromDynamicField(_tableId, _keyTuple, 1, 32);
  }

  /**
   * @notice Pop an element from entity.
   */
  function _popEntity(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.popFromDynamicField(_tableId, _keyTuple, 1, 32);
  }

  /**
   * @notice Pop an element from entity (using the specified store).
   */
  function popEntity(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.popFromDynamicField(_tableId, _keyTuple, 1, 32);
  }

  /**
   * @notice Update an element of entity at `_index`.
   */
  function updateEntity(bytes32 key, uint256 _index, bytes32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = abi.encodePacked((_element));
      StoreSwitch.spliceDynamicData(_tableId, _keyTuple, 1, uint40(_index * 32), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update an element of entity at `_index`.
   */
  function _updateEntity(bytes32 key, uint256 _index, bytes32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = abi.encodePacked((_element));
      StoreCore.spliceDynamicData(_tableId, _keyTuple, 1, uint40(_index * 32), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Update an element of entity (using the specified store) at `_index`.
   */
  function updateEntity(IStore _store, bytes32 key, uint256 _index, bytes32 _element) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    unchecked {
      bytes memory _encoded = abi.encodePacked((_element));
      _store.spliceDynamicData(_tableId, _keyTuple, 1, uint40(_index * 32), uint40(_encoded.length), _encoded);
    }
  }

  /**
   * @notice Get the full data.
   */
  function get(bytes32 key) internal view returns (GameData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    (bytes memory _staticData, PackedCounter _encodedLengths, bytes memory _dynamicData) = StoreSwitch.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Get the full data.
   */
  function _get(bytes32 key) internal view returns (GameData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    (bytes memory _staticData, PackedCounter _encodedLengths, bytes memory _dynamicData) = StoreCore.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Get the full data (using the specified store).
   */
  function get(IStore _store, bytes32 key) internal view returns (GameData memory _table) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    (bytes memory _staticData, PackedCounter _encodedLengths, bytes memory _dynamicData) = _store.getRecord(
      _tableId,
      _keyTuple,
      _fieldLayout
    );
    return decode(_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function set(bytes32 key, string memory name, bytes32[] memory entity) internal {
    bytes memory _staticData;
    PackedCounter _encodedLengths = encodeLengths(name, entity);
    bytes memory _dynamicData = encodeDynamic(name, entity);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using individual values.
   */
  function _set(bytes32 key, string memory name, bytes32[] memory entity) internal {
    bytes memory _staticData;
    PackedCounter _encodedLengths = encodeLengths(name, entity);
    bytes memory _dynamicData = encodeDynamic(name, entity);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using individual values (using the specified store).
   */
  function set(IStore _store, bytes32 key, string memory name, bytes32[] memory entity) internal {
    bytes memory _staticData;
    PackedCounter _encodedLengths = encodeLengths(name, entity);
    bytes memory _dynamicData = encodeDynamic(name, entity);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function set(bytes32 key, GameData memory _table) internal {
    bytes memory _staticData;
    PackedCounter _encodedLengths = encodeLengths(_table.name, _table.entity);
    bytes memory _dynamicData = encodeDynamic(_table.name, _table.entity);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Set the full data using the data struct.
   */
  function _set(bytes32 key, GameData memory _table) internal {
    bytes memory _staticData;
    PackedCounter _encodedLengths = encodeLengths(_table.name, _table.entity);
    bytes memory _dynamicData = encodeDynamic(_table.name, _table.entity);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData, _fieldLayout);
  }

  /**
   * @notice Set the full data using the data struct (using the specified store).
   */
  function set(IStore _store, bytes32 key, GameData memory _table) internal {
    bytes memory _staticData;
    PackedCounter _encodedLengths = encodeLengths(_table.name, _table.entity);
    bytes memory _dynamicData = encodeDynamic(_table.name, _table.entity);

    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.setRecord(_tableId, _keyTuple, _staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Decode the tightly packed blob of dynamic data using the encoded lengths.
   */
  function decodeDynamic(
    PackedCounter _encodedLengths,
    bytes memory _blob
  ) internal pure returns (string memory name, bytes32[] memory entity) {
    uint256 _start;
    uint256 _end;
    unchecked {
      _end = _encodedLengths.atIndex(0);
    }
    name = (string(SliceLib.getSubslice(_blob, _start, _end).toBytes()));

    _start = _end;
    unchecked {
      _end += _encodedLengths.atIndex(1);
    }
    entity = (SliceLib.getSubslice(_blob, _start, _end).decodeArray_bytes32());
  }

  /**
   * @notice Decode the tightly packed blobs using this table's field layout.
   *
   * @param _encodedLengths Encoded lengths of dynamic fields.
   * @param _dynamicData Tightly packed dynamic fields.
   */
  function decode(
    bytes memory,
    PackedCounter _encodedLengths,
    bytes memory _dynamicData
  ) internal pure returns (GameData memory _table) {
    (_table.name, _table.entity) = decodeDynamic(_encodedLengths, _dynamicData);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreSwitch.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Delete all data for given keys.
   */
  function _deleteRecord(bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    StoreCore.deleteRecord(_tableId, _keyTuple, _fieldLayout);
  }

  /**
   * @notice Delete all data for given keys (using the specified store).
   */
  function deleteRecord(IStore _store, bytes32 key) internal {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    _store.deleteRecord(_tableId, _keyTuple);
  }

  /**
   * @notice Tightly pack dynamic data lengths using this table's schema.
   * @return _encodedLengths The lengths of the dynamic fields (packed into a single bytes32 value).
   */
  function encodeLengths(
    string memory name,
    bytes32[] memory entity
  ) internal pure returns (PackedCounter _encodedLengths) {
    // Lengths are effectively checked during copy by 2**40 bytes exceeding gas limits
    unchecked {
      _encodedLengths = PackedCounterLib.pack(bytes(name).length, entity.length * 32);
    }
  }

  /**
   * @notice Tightly pack dynamic (variable length) data using this table's schema.
   * @return The dynamic data, encoded into a sequence of bytes.
   */
  function encodeDynamic(string memory name, bytes32[] memory entity) internal pure returns (bytes memory) {
    return abi.encodePacked(bytes((name)), EncodeArray.encode((entity)));
  }

  /**
   * @notice Encode all of a record's fields.
   * @return The static (fixed length) data, encoded into a sequence of bytes.
   * @return The lengths of the dynamic fields (packed into a single bytes32 value).
   * @return The dyanmic (variable length) data, encoded into a sequence of bytes.
   */
  function encode(
    string memory name,
    bytes32[] memory entity
  ) internal pure returns (bytes memory, PackedCounter, bytes memory) {
    bytes memory _staticData;
    PackedCounter _encodedLengths = encodeLengths(name, entity);
    bytes memory _dynamicData = encodeDynamic(name, entity);

    return (_staticData, _encodedLengths, _dynamicData);
  }

  /**
   * @notice Encode keys as a bytes32 array using this table's field layout.
   */
  function encodeKeyTuple(bytes32 key) internal pure returns (bytes32[] memory) {
    bytes32[] memory _keyTuple = new bytes32[](1);
    _keyTuple[0] = key;

    return _keyTuple;
  }
}
