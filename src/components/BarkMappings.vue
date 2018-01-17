<template>
  <v-layout row wrap>
    <template v-for="(field, index) in value">
      <v-flex xs3>
        <v-text-field
          label="Input"
          :value="field.input"
          ref="fieldInputs"
          @input="updateFieldInput(index)"
        ></v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-text-field
          label="CustomValue"
          :value="field.val"
          ref="fieldVals"
          @input="updateFieldVal(index)"
        ></v-text-field>
      </v-flex>
      <v-flex xs4>
        <v-select
          v-bind:items="outputs"
          item-text="key"
          item-value="key"
          label="Output"
          :value="field.output"
          ref="fieldOutputs"
          @input="updateFieldOutput(index)"
        ></v-select>
      </v-flex>
      <v-flex xs1>
        <v-btn flat icon color="red" @click="remove(index)">
          <v-icon>delete</v-icon>
        </v-btn>
      </v-flex>
    </template>
    <v-btn @click="add">Add Field</v-btn>
  </v-layout>
</template>

<script>
  export default {
    props: ['value', 'outputs'],
    data() {
      return {
      }
    },
    methods: {
      updateFieldInput(index) {
        var copy = this.value.slice();
        copy[index]["input"] = this.$refs.fieldInputs[index].inputValue;
        this.$emit('input', copy);
      },
      updateFieldOutput(index) {
        var copy = this.value.slice();
        copy[index]["output"] = this.$refs.fieldOutputs[index].inputValue;
        this.$emit('input', copy);
      },
      updateFieldVal(index) {
        var copy = this.value.slice();
        copy[index]["val"] = this.$refs.fieldVals[index].inputValue;
        this.$emit('input', copy);
      },
      add() {
        this.$emit('add', {input: "", val:"", output: ""})
      },
      remove(index) {
        this.$emit('remove', index)
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
