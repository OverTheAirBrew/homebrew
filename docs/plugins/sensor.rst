Sensors
=======

.. code-block:: typescript

  @Service({ id: SensorToken, multiple: true })
  export class ExamplePlugin extends Sensor {
      constructor(){
        super('example-plugin', [])
      }

      public async run(params: any) {
        // code to look up the sensor values
      }
  }
