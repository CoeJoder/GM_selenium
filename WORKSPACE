workspace(
    name = "GM_selenium",
)

load("//tools:bazel_deps.bzl", "fetch_dependencies")
fetch_dependencies()

# @rules_pkg (transitive dependency of protobuf)
load("@rules_pkg//:deps.bzl", "rules_pkg_dependencies")
rules_pkg_dependencies()

# @io_bazel_rules_closure (build toolchain)
load("@io_bazel_rules_closure//closure:repositories.bzl", "rules_closure_dependencies", "rules_closure_toolchains")
rules_closure_dependencies()
rules_closure_toolchains()

# @rules_jvm_external (transitive dependency of @selenium)
load("@rules_jvm_external//:repositories.bzl", "rules_jvm_external_deps")
rules_jvm_external_deps()
load("@rules_jvm_external//:setup.bzl", "rules_jvm_external_setup")
rules_jvm_external_setup()

# @contrib_rules_jvm (transitive dependency of @selenium)
load("@contrib_rules_jvm//:repositories.bzl", "contrib_rules_jvm_deps")
contrib_rules_jvm_deps()
load("@contrib_rules_jvm//:setup.bzl", "contrib_rules_jvm_setup")
contrib_rules_jvm_setup()
