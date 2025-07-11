if (!window.indexOfSafePatched) {
  const safeIndexOf = Object.getOwnPropertyDescriptor(String.prototype, "indexOf");
  String.prototype.indexOf = function (search) {
    if (this == null || typeof this === "undefined") return -1;
    return safeIndexOf.value.call(this, search);
  };
  window.indexOfSafePatched = true;
}